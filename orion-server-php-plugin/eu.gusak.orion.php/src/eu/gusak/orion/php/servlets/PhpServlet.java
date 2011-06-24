/*******************************************************************************
 * Copyright (c) 2010, 2011 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 * 
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
package eu.gusak.orion.php.servlets;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.InvalidParameterException;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.core.resources.IFile;
import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IncrementalProjectBuilder;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.dltk.core.CompletionProposal;
import org.eclipse.dltk.core.CompletionRequestor;
import org.eclipse.dltk.core.DLTKCore;
import org.eclipse.dltk.core.ISourceModule;
import org.eclipse.dltk.core.ModelException;
import org.eclipse.orion.server.servlets.OrionServlet;
import org.eclipse.php.internal.core.PHPVersion;
import org.json.JSONArray;
import org.json.JSONException;

import eu.gusak.orion.internal.php.OrionPhpPlugin;

/**
 * A servlet for accessing and modifying preferences.
 * GET /prefs/ to return the preferences and children of the preference root node as a JSON object (the children of the root are the scopes)
 * GET /prefs/[path] returns the preferences and children of the given preference node as a JSON object
 * GET /prefs/[path]?key=[key] returns the value of the preference in the node at the given path, with the given key, as a JSON string
 * PUT /prefs/[path] sets all the preferences at the given path to the provided JSON object
 * PUT /prefs/[path]?key=[key]&value=[value] sets the value of the preference at the given path with the given key to the provided value
 * DELETE /prefs/[path] to delete an entire preference node
 * DELETE /prefs/[path]?key=[key] to delete a single preference at the given path with the given key
 */
public class PhpServlet extends OrionServlet {

	private static final long serialVersionUID = 1L;

	private static final int COMPLETION_TIMEOUT = 5000;

	private static final String FILE_NAME = "script.php";
	private static IFile phpFile;

	private static IProject project;


	public PhpServlet() {
		super();
	}

	@Override
	public void init() throws ServletException {
		super.init();

		project = OrionPhpPlugin.getProject();

		if (phpFile != null) {
			try {
				phpFile.delete(true, null);
			} catch (CoreException e) {}
		}
	}

	@Override
	public void destroy() {
		phpFile = null;
		super.destroy();
	}

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		traceRequest(req);

		// Load script source
		String script = req.getParameter("script");
		if (script == null) {
			handleException(resp, "No script parameter provided", new InvalidParameterException());
			return;
		}
		OrionPhpPlugin.debug("Script: " + script);

		// Read the offset (position of cursor in the editor)
		int offset = 0;
		String ossetString = req.getParameter("offset");
		try {
			offset = Integer.parseInt(ossetString);
		} catch (NumberFormatException e) {
			handleException(resp, "No offset parameter provided", e);
			return;
		}
		OrionPhpPlugin.debug("Offset: " + offset);

		// Set PHP Version if defined
		String versionString = req.getParameter("phpversion");
		PHPVersion phpVersion = PHPVersion.PHP5_3;
		if (versionString != null) {
			try {
				int versionInt =  Integer.parseInt(versionString);

				switch (versionInt) {
				case 4:
					phpVersion = PHPVersion.PHP4;
					break;
				case 5:
					phpVersion = PHPVersion.PHP5;
					break;
				default: 
					phpVersion = PHPVersion.PHP5_3;
					break;
				}
			} catch (NumberFormatException e) {}
		}

		try {
			OrionPhpPlugin.setProjectPhpVersion(phpVersion);
		} catch (CoreException e) {
			handleException(resp, "Problem with setting PHP version", e);
			return;
		}
		OrionPhpPlugin.debug("PHPVersion: " + phpVersion.toString());

		// Save script into file in the project and wait for build
		try {
			phpFile = project.getFile(FILE_NAME);
			phpFile.create(new ByteArrayInputStream(script.getBytes()), true, null);
			project.refreshLocal(IResource.DEPTH_INFINITE, null);
			project.build(IncrementalProjectBuilder.FULL_BUILD, null);
		} catch (CoreException e) {
			removeFile();
			handleException(resp, "Problem with saving script file", e);
			return;
		}

		OrionPhpPlugin.waitForIndexer();
		// PHPCoreTests.waitForAutoBuild();

		// Generate the proposals array
		String[] proposalsArray = null;
		try {
			CompletionProposal[] proposals = getProposals(DLTKCore.createSourceModuleFrom(phpFile), offset);
			OrionPhpPlugin.debug("Number of proposals: " + proposals.length);
			proposalsArray = new String[proposals.length];
			int i = 0;
			for (CompletionProposal proposal : proposals) {
				proposalsArray[i] = proposal.getCompletion();
				++i;
			}
		} catch (ModelException e) {
			removeFile();
			handleException(resp, "Could not generate completion proposals", e);
			return;
		}

		// Send the proposals in response
		try {
			JSONArray result = null;
			result = new JSONArray(proposalsArray);
			writeJSONResponse(req, resp, result);
		} catch (JSONException e) {
			removeFile();
			handleException(resp, "Could not send JSON response", e);
			return;
		}

		removeFile();
	}

	public static CompletionProposal[] getProposals(ISourceModule sourceModule, int offset) throws ModelException {
		final List<CompletionProposal> proposals = new LinkedList<CompletionProposal>();
		sourceModule.codeComplete(offset, new CompletionRequestor() {
			public void accept(CompletionProposal proposal) {
				proposals.add(proposal);
			}
		}, COMPLETION_TIMEOUT);
		return (CompletionProposal[]) proposals.toArray(new CompletionProposal[proposals.size()]);
	}

	private static void removeFile() {
		if (phpFile != null) {
			try {
				phpFile.delete(true, null);
			} catch (CoreException e) {}
		}
	}

	@Override
	protected void handleException(HttpServletResponse resp, String msg, Exception e) throws ServletException {
		OrionPhpPlugin.debug(msg);
		super.handleException(resp, msg, e);
	}
}
