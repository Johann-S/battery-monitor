const { app } = require('electron')
const { autoUpdater } = require('electron-updater')
const log = require('electron-log')

const checkUpdates = () => {
  if (!app.isPackaged) {
    return
  }

  log.transports.file.level = 'info'
  autoUpdater.logger = log
  autoUpdater.checkForUpdatesAndNotify()
}

module.exports = checkUpdates
