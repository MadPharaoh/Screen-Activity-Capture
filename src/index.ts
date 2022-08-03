import "source-map-support"
import { app, BrowserWindow } from "electron"
import os, { platform } from "os"
import { init as initSocket } from "./Handlers/socketHandler"
import { checkForUpdates } from "./Updater/autoUpdater"
import { update as initAutoLaunch } from "./Handlers/autoLaunchHandler"
import { TrayHandler } from "./Handlers/TrayHandler"
import isOnline from "is-online"

export let trayHandler: TrayHandler
let mainWindow: BrowserWindow

// Lock app in one instance to prevent multiple instances running
let singleInstanceLock = app.requestSingleInstanceLock();

// Connect to the server
const browserWindow = () => {
    mainWindow = new BrowserWindow ({
        height: 600,
        width: 800,
        show: false,
        frame: false
    })
    mainWindow.loadURL(`http://localhost:3001/${os.hostname()}`)
}

// Check if Application is already Running? Yes, kill the new instance 
if (!singleInstanceLock) app.quit();

// Set AppUserModeId for Task Mnager
app.setAppUserModelId("Capture-User-Desktop")

// Check for Updates and Connection Status - Start AutoLunch and Hidden Main Window
const onReady = async () => {
    if ( await isOnline({ timeout: 10000 })) {
        trayHandler = new TrayHandler();
	await Promise.all([checkForUpdates(), initAutoLaunch(), initSocket(), browserWindow()]);
	if (platform() === "darwin") app.dock.hide();
    }
}

app.whenReady().then( () => { onReady() })