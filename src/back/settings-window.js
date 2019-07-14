const { BrowserWindow } = require('electron')

const openSettingsWindow = (mainWindow) => {
  const winSettings = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    frame: false,
    width: 530,
    height: 400,
    center: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  winSettings.loadFile('app/settings.html')
  winSettings.once('ready-to-show', () => {
    winSettings.show()
  })

  return winSettings
}

module.exports = {
  openSettingsWindow
}
