const { app } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

log.transports.file.level = 'info'
autoUpdater.logger = log

const checkUpdates = () => {
  if (!app.isPackaged) {
    return
  }

  autoUpdater.checkForUpdates()
}

module.exports = checkUpdates
