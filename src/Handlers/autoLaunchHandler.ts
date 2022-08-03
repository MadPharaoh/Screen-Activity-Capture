import AutoLaunch from "auto-launch";
import { app } from "electron";

//* Create autoLaunch object
let autoLaunch = new AutoLaunch({
	name: app.name,
	isHidden: true
});

/**
 * Updates autoLaunch
 */
export async function update() {
	//* If app not packaged return
	//* Either enable/disable autolaunch
	if (!app.isPackaged) {
		//* Show debug
		//* Return
		console.log("Skipping autoLaunch.");
		return;
	}
	autoLaunch.enable()
}