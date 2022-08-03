import {  autoUpdater } from "electron-updater";
import * as Logger from './Logger'
// Connect Our Logger to the App
Logger.connect()

let updateChecked = false

export const checkForUpdates = () => {
    if (updateChecked) {
      return
    }
    updateChecked = true
    console.log('Checking for updates...')
  
    autoUpdater.on('checking-for-update', () => {
      console.log('Checking for updates...')
    })
    autoUpdater.on('update-available', (info) => {
      console.log('Update available.' + info)
    })
    autoUpdater.on('update-not-available', (info) => {
      console.log('Update not available.' + info)
    })
    autoUpdater.on('error', (err) => {
      console.log('Error in auto-updater.' + err)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = 'download speed: ' + progressObj.bytesPerSecond
      log_message = log_message + ' - Download ' + progressObj.percent + '%'
      log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
      console.log(log_message)
    })
    autoUpdater.on('update-downloaded', (info) => {
      console.log('Update dwonloaded.' + info)
    })
    autoUpdater.logger = Logger.log
    autoUpdater.checkForUpdatesAndNotify()
  
  }