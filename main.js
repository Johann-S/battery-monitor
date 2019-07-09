const { app, BrowserWindow, ipcMain } = require('electron')
const si = require('systeminformation')

app.on('ready', () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  ipcMain.on('get-battery-info', (event) => {
    si.battery(({ hasbattery, ischarging, percent, acconnected }) => {
      event.reply('battery-info', {
        hasbattery,
        ischarging,
        percent,
        acconnected
      })
    })
  })
  win.loadFile('index.html')
})
