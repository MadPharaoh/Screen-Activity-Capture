import { desktopCapturer } from "electron"

// Electron Screen Capture
export function getDesktopCaptureSources() {
    return new Promise((reslove, _reject) => {
      desktopCapturer.getSources({types: ['window', 'screen'], thumbnailSize: {width:1280, height:800}}).then(sources => {
        return reslove(sources.map(source =>{
          return {
            time: new Date().toLocaleString(),
            name: source.name,
            recorder: source.thumbnail.toDataURL(),
          }
        }))
      })
    })
}

