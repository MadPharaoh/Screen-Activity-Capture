import { app, dialog } from "electron"
import * as os from "os"
import { createServer, Server } from "http"
import { trayHandler } from "..";
import express from "express"
import fs from 'fs'
import socketIo from "socket.io";
import { getDesktopCaptureSources } from "./captureScreenHandler";
import path from "path";
import { router } from "./routeHandler"

// Express js Connection  
let web = express()
web.use(express.static(path.join(__dirname, "../../assets/avatars")));
web.use(`/`, router);

export let io: socketIo.Server;
export let socket: socketIo.Socket;
export let server: Server;
export let connected: boolean = false;

export function init() {
    return new Promise<void>(resolve => {

        //Running socket io with Express js
        server = createServer(web);
        io = new socketIo.Server(server, {
            serveClient: false,
            allowEIO3: true,
            allowRequest: (req, callback) => {
				const noOriginHeader = req.headers.origin === undefined;
				callback(null, noOriginHeader);
			}
        });
        server.listen(3001, () => {
            resolve();
            console.log("Opened Socket")
        })
        server.on("error", socketError)
        io.on('connection', socketConnection);    
        })
}

function socketConnection(cSocket: socketIo.Socket) {
    console.log("Socket Connection")
    socket = cSocket; 
     
    // Capture screen function on Connection per Second
    setInterval(() => { 
        getDesktopCaptureSources()
        .then(info => io.sockets.emit("info", info))
        .catch(_ => io.sockets.emit("info", null)
    )}, 1000)
     
    // UserName fetched from operating system hostname
    io.sockets.emit("username", os.hostname())


     //Read saved Logs For Every User
    fs.readdir(__dirname + `/public/users/` + os.hostname(),(_err, files) => {
            io.sockets.emit("files", files)
            socket.on('current-File-Name', (args: string) => {
            web.get(`/${os.hostname}/Logs/:name`, function(_req, res) {
                fs.readFile(__dirname + `/public/users/${os.hostname()}/` + args, 'utf-8', function(err, data) {
                    if (err) throw err;
                    console.log(`Open: ${__dirname + `/public/users/${os.hostname()}/` + args}`)
                    res.send(JSON.parse(JSON.stringify(data)))

                })
            })
            
            })
            //Open the Logs File
            socket.on('open-File', (args: string) => {
                fs.readFile(__dirname + `/public/users/${os.hostname()}/` + args, 'utf-8', function(err, data) {
                    if (err) throw err;
                    console.log(`Open: ${__dirname + `/public/users/${os.hostname()}/` + args}`)
                    io.sockets.emit('file-Data', JSON.parse(JSON.stringify(data)))
                })
            })
    });
    // Check if User Directory is their or no
    socket.on("data", (capture) => {
        if (fs.existsSync(__dirname + `/public/users/${os.hostname()}`)) {
            fs.appendFile(__dirname + `/public/users/${os.hostname()}/${os.hostname()}` +
        new Date().toLocaleDateString().replace(/[\/]/g , '-')
        + ".txt", JSON.stringify(capture),(err) => {
            if (err) console.log(err)
        })
        } else if (!fs.existsSync(__dirname + `/public/users/${os.hostname()}`)) {
            fs.mkdir((__dirname + `/public/users/` + os.hostname()) , {recursive: true},(_err) => {
                fs.appendFile(__dirname + `/public/users/${os.hostname()}/${os.hostname()}` +
                new Date().toLocaleDateString().replace(/[\/]/g , '-')
                + ".txt", JSON.stringify(capture),(err) => {
                    if (err) console.log(err)
                })
            });
        }

    })

    socket.once("disconnect", () => {
        connected = false;
        trayHandler.info();
    });
    connected = true;
    trayHandler.info();

}
function socketError(e: any) {
	console.log(e.message);
	if (e.code === "EADDRINUSE") {
		//* Focus app
		//* Show error dialog
		//* Exit app afterwards
		app.focus();
		dialog.showErrorBox(
			"Oh noes! Port error...",
			`${app.name} could not bind to port ${e.port}.\nIs ${app.name} running already?`
		);
		app.quit();
	}
}



