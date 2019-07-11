const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('path')
const { getBatteryInformation, getBatteryImage, monitorBattery } = require('./src/back/battery-helper')
const Settings = require('./src/back/settings')
const intervalTrayIcon = 10000

let appTray
let win
let winSettings

app.on('ready', () => {
  const settings = new Settings()

  getBatteryInformation().then(({ hasbattery, percent, ischarging }) => {
    const iconName = getBatteryImage(hasbattery, percent, ischarging)
    const iconPath = path.join(`${__dirname}/icon`, iconName)
    const iconWhitePath = path.join(`${__dirname}/icon/white`, iconName)

    win = new BrowserWindow({
      width: 330,
      height: 450,
      icon: iconPath,
      center: true,
      resizable: false,
      maximizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    })

    const contextMenu = Menu.buildFromTemplate([
      {
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

    appTray = new Tray(iconWhitePath)
    appTray.setContextMenu(contextMenu)
    appTray.setToolTip('Battery monitor')
    setInterval(() => monitorBattery(appTray, win), intervalTrayIcon)

    ipcMain.on('get-battery-info', event => {
      getBatteryInformation()
        .then(batteryInformation => event.reply('battery-info', batteryInformation))
    })

    ipcMain.on('open-settings', () => {
      winSettings = new BrowserWindow({
        parent: win,
        modal: true,
        show: false,
        frame: false,
        width: 530,
        height: 380,
        webPreferences: {
          nodeIntegration: true
        }
      })

      winSettings.loadFile('settings.html')
      winSettings.once('ready-to-show', () => {
        winSettings.show()
      })
    })
    ipcMain.on('close-settings', (event, newSettings) => {
      settings.setAll(newSettings)
      winSettings.close()
    })

    win.on('minimize', event => {
      event.preventDefault()
      win.hide()
    })
    win.loadFile('index.html')
  })
})
