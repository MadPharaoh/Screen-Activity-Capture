import { app, Menu, shell, Tray } from "electron"
import { platform } from "os"
import { trayHandler } from ".."
import { connected } from "./socketHandler"
import path from 'path'

let trayicon;

switch (platform()) {
    case "darwin":
        trayicon = path.join(__dirname, '../../assets/icon-mac.png')
        break
    case "win32":
        trayicon = path.join(__dirname, '../../assets/icon.png')
        break
    case "linux":
        trayicon = path.join(__dirname, '../../assets/icon.png')
        break
    default:
        trayicon = path.join(__dirname, '../../assets/icon.png')
        break
}
export class TrayHandler {
    tray: Tray

    constructor() {
        this.tray = new Tray(trayicon)
        this.tray.setToolTip(app.name)
        this.tray.on("right-click", () => this.info())

    }

    info() {
        this.tray.setContextMenu(
            Menu.buildFromTemplate([
                {
                    icon: 
                           platform() === "darwin"
                                    ? path.join(__dirname, '../../assets/icon-mac.png')
                                    : path.join(__dirname, '../../assets/icon.png'),
                    label: `${app.name} v${app.getVersion()}`,
                    enabled: false
                },
                {
                    id: "connectInfo",
                    label: `Extension - ${connected ? "Connected" : "Not connnected"}`,
                    enabled: false
                },
                {
                    type: "separator"
                },
                {
                    label: "Support Creator",
                    click: () => shell.openExternal("https://ko-fi.com/pharaoh1337")
                },
                {
                    type: "separator"
                },
                {
                    label: `Quit ${app.name}`,
                    click: () => app.quit()
                }
            ])
        )
    }
}

app.once("quit", () => {
    trayHandler?.tray.destroy()
})