package eu.gusak.orion.internal.php;

import org.eclipse.core.resources.IProject;
import org.eclipse.core.resources.IProjectDescription;
import org.eclipse.core.resources.IResource;
import org.eclipse.core.resources.IncrementalProjectBuilder;
import org.eclipse.core.resources.ResourcesPlugin;
import org.eclipse.core.runtime.CoreException;
import org.eclipse.core.runtime.OperationCanceledException;
import org.eclipse.core.runtime.Plugin;
import org.eclipse.core.runtime.jobs.Job;
import org.eclipse.dltk.internal.core.ModelManager;
import org.eclipse.php.internal.core.PHPCorePlugin;
import org.eclipse.php.internal.core.PHPVersion;
import org.eclipse.php.internal.core.project.PHPNature;
import org.eclipse.php.internal.core.project.ProjectOptions;
import org.osgi.framework.BundleContext;

public class OrionPhpPlugin extends Plugin {

	private static final boolean DEBUG = true;

	// The plug-in ID
	public static final String PLUGIN_ID = "eu.gusak.orion.php";

	// The shared instance
	private static OrionPhpPlugin plugin;

	// Project is used to place temporary PHP file and compile it
	private static IProject project;


	public void start(BundleContext context) throws Exception {
		super.start(context);

		plugin = this;
		PHPCorePlugin.toolkitInitialized = true;

		project = ResourcesPlugin.getWorkspace().getRoot().getProject(PLUGIN_ID);
		if (project.exists()) {
			OrionPhpPlugin.debug("Project exists, removing");

			project.close(null);
			project.delete(true, true, null);
		} else {
			OrionPhpPlugin.debug("Project doesn't exist, creating");
		}

		project.create(null);
		project.open(null);

		IProjectDescription description = project.getDescription();
		description.setNatureIds(new String[] { PHPNature.ID });
		project.setDescription(description, null);

		OrionPhpPlugin.debug("Plugin is initialized");
	}

	public void stop(BundleContext context) throws Exception {
		project.close(null);
		project.delete(true, true, null);
		project = null;

		plugin = null;
		super.stop(context);
	}

	public static OrionPhpPlugin getDefault() {
		return plugin;
	}

	public static IProject getProject() {
		return project;
	}

	public static void setProjectPhpVersion(PHPVersion phpVersion) throws CoreException {
		if (phpVersion != ProjectOptions.getPhpVersion(project)) {
			ProjectOptions.setPhpVersion(phpVersion, project);
			waitForAutoBuild();
			waitForIndexer();
		}
	}

	public static void waitForIndexer() {
		ModelManager.getModelManager().getIndexManager().waitUntilReady();
	}

	public static void waitForAutoBuild() {
		boolean wasInterrupted = false;
		do {
			try {
				Job.getJobManager().join(ResourcesPlugin.FAMILY_AUTO_BUILD, null);
				wasInterrupted = false;
			} catch (OperationCanceledException e) {
				throw (e);
			} catch (InterruptedException e) {
				wasInterrupted = true;
			}
		} while (wasInterrupted);
	}

	public static void debug(String message) {
		if (DEBUG)
			System.out.println("[" + PLUGIN_ID + "] " + message);
	}
}
