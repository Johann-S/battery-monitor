const electron = require('electron')
const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu
} = electron
const path = require('path')
const { getBatteryInformation, getBatteryImage, monitorBattery } = require('./src/back/battery-helper')
const Settings = require('./src/back/settings')
const Translator = require('./src/back/translator')
const checkUpdates = require('./src/back/auto-updater')

let appTray
let win
let winSettings
let isQuitingApp = false

const intervalTrayIcon = 10000
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) {
      win.restore()
    }

    win.focus()
  }
})

app.on('ready', () => {
  const settings = new Settings()
  const translator = new Translator()

  global.translator = translator

  getBatteryInformation().then(({ hasbattery, percent, ischarging }) => {
    const iconName = getBatteryImage(hasbattery, percent, ischarging)
    const iconPath = path.join(`${__dirname}/icon`, iconName)
    const iconWhitePath = path.join(`${__dirname}/icon/white`, iconName)

    win = new BrowserWindow({
      width: 330,
      height: 450,
      icon: iconPath,
      center: true,
      resizable: !app.isPackaged,
      maximizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true
      }
    })

    const contextMenu = Menu.buildFromTemplate([
      {
        label: translator.translate('show'),
        click () {
          win.show()
        }
      },
      {
        label: translator.translate('quit'),
        click () {
          isQuitingApp = true
          app.quit()
        }
      }
    ])

    appTray = new Tray(iconWhitePath)
    appTray.setContextMenu(contextMenu)
    appTray.setToolTip(`Battery monitor (${percent}%)`)
    setInterval(() => monitorBattery(settings, appTray, win), intervalTrayIcon)

    appTray.on('click', () => {
      if (!win.isVisible()) {
        win.show()
      }
    })

    ipcMain.on('get-battery-info', event => {
      getBatteryInformation()
        .then(batteryInformation => event.reply('battery-info', batteryInformation))
    })

    ipcMain.on('get-settings', event => {
      event.reply('settings', settings.getAll())
    })

    ipcMain.on('open-settings', () => {
      winSettings = new BrowserWindow({
        parent: win,
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
    })
    ipcMain.on('close-settings', (event, newSettings) => {
      settings.setAll(newSettings)
      winSettings.close()
    })

    win.on('minimize', event => {
      event.preventDefault()
      win.hide()
    })

    win.on('close', event => {
      if (!isQuitingApp) {
        event.preventDefault()
        win.hide()
      }
    })

    electron.powerMonitor.on('on-ac', () => monitorBattery(settings, appTray, win))
    electron.powerMonitor.on('on-battery', () => monitorBattery(settings, appTray, win))

    checkUpdates()
    win.loadFile('app/index.html')
  })
})
