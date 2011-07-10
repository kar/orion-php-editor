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
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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

import eu.gusak.orion.internal.php.OrionPhpPlugin;

/**
 * A servlet for accessing Orion PHP Editor functionality.
 * GET /php/?script=[script]&offset=[offset]&prefix=[prefix] to return the completion proposals for a caret position placed in [offset] inside PHP [script]. Completion starts with [prefix]. PHP version: 5.3
 * GET /php/?script=[script]&offset=[offset]&prefix=[prefix]&phpversion=[phpversion] same as above, but additionaly sets PHP version to 4, 5, or 53 (5.3)
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
		String offsetString = req.getParameter("offset");
		try {
			offset = Integer.parseInt(offsetString);
		} catch (NumberFormatException e) {
			handleException(resp, "No offset parameter provided", e);
			return;
		}
		OrionPhpPlugin.debug("Offset: " + offset);

		// Read the prefix (to compute offsets for parameters in Linked Mode)
		String prefix = req.getParameter("prefix");
		if (prefix == null) {
			handleException(resp, "No prefix parameter provided", new InvalidParameterException());
			return;
		}
		OrionPhpPlugin.debug("Prefix: " + prefix);

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
		JSONArray result = new JSONArray();

		try {
			CompletionProposal[] proposals = getProposals(DLTKCore.createSourceModuleFrom(phpFile), offset);
			OrionPhpPlugin.debug("Number of proposals: " + proposals.length);
//			proposalsArray = new String[proposals.length];
			int i = 0;
			for (CompletionProposal proposal : proposals) {
				String[] parameters = proposal.findParameterNames(null);
				if (parameters == null) {
					result.put(proposal.getCompletion());
				} else {
					Map<String, Object> proposalWithParameters = getProposalInfo(offset, prefix, proposal, parameters);
					result.put(proposalWithParameters);
				}

				OrionPhpPlugin.debug("Number of parameters: " + ((parameters == null) ? "none" : parameters.length));
				++i;
			}
		} catch (ModelException e) {
			removeFile();
			handleException(resp, "Could not generate completion proposals", e);
			return;
		}

		// Send the proposals in response
//		try {
//			JSONArray result = null;
//			result = new JSONArray(proposalsArray);
			writeJSONResponse(req, resp, result);
//		} catch (JSONException e) {
//			removeFile();
//			handleException(resp, "Could not send JSON response", e);
//			return;
//		}

		removeFile();
	}

	public static Map<String, Object> getProposalInfo(int offset, String prefix, CompletionProposal proposal, String[] parameters) {
		if (proposal.getName() == null) {
			// TODO
		}

		String proposalWithParameters = proposal.getName() + "(";
		List<Map<String, Integer>> positions = new ArrayList<Map<String, Integer>>();
		int i = 0;
		for (String parameter : parameters) {
			Map<String, Integer> position = new HashMap<String, Integer>();
			position.put("offset", offset - prefix.length() + proposalWithParameters.length());
			position.put("length", parameter.length());
			positions.add(position);
	
			proposalWithParameters += parameter;
			if (i < parameters.length - 1) {
				proposalWithParameters += ", ";
			}
			++i;
		}
		proposalWithParameters += ")";

		int escapePosition = offset - prefix.length() + proposalWithParameters.length();

		Map<String, Object> result = new HashMap<String, Object>();
		result.put("proposal", proposalWithParameters);
		result.put("escapePosition", escapePosition);
		result.put("parametersPositions", positions);

		return result;
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
