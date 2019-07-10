const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('path')
const { getBatteryInformation, getBatteryImage } = require('./src/back/battery-helper')

let appTray
app.on('ready', () => {
  getBatteryInformation().then(({ hasbattery, percent }) => {
    const iconName = getBatteryImage(hasbattery, percent)
    const iconPath = path.join(`${__dirname}/battery-icon`, iconName)
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: iconPath,
      webPreferences: {
        nodeIntegration: true
      }
    })

    const contextMenu = Menu.buildFromTemplate([{
        label: 'Show',
        click() {
          win.show()
        }
      },
      {
        label: 'Quit',
        click() {
          app.quit()
        }
      }
    ])

    appTray = new Tray(iconPath)
    appTray.setContextMenu(contextMenu)

    ipcMain.on('get-battery-info', event => {
      getBatteryInformation()
        .then(batteryInformation => event.reply('battery-info', batteryInformation))
    })

    win.on('minimize', event => {
      event.preventDefault()
      win.hide()
    })
    win.loadFile('index.html')
  })
})
