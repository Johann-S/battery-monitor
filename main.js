const { app, BrowserWindow, ipcMain, Tray, Menu, Notification } = require('electron')
const path = require('path')
const { getBatteryInformation, getBatteryImage } = require('./src/back/battery-helper')
const intervalTrayIcon = 10000

let appTray
let win

const state = {
  twentyPercentWarned: false,
  tenPercentWarned: false
}

const monitorBattery = () => {
  getBatteryInformation().then(({ hasbattery, percent, ischarging }) => {
    const iconName = getBatteryImage(hasbattery, percent, ischarging)
    const iconPath = path.join(`${__dirname}/battery-icon`, iconName)
    const iconWhitePath = path.join(`${__dirname}/battery-icon/white`, iconName)

    appTray.setImage(iconWhitePath)
    win.setIcon(iconPath)

    if (!hasbattery || !Notification.isSupported()) {
      return
    }

    if (percent > 10 && state.tenPercentWarned) {
      state.tenPercentWarned = false
    }

    if (percent > 20 && state.twentyPercentWarned) {
      state.twentyPercentWarned = false
    }

    if (percent < 10 && !state.tenPercentWarned) {
      const notification = new Notification({
        title: `You're under 10% of your battery level`,
        body: 'You should charge your battery as soon as possible',
        icon: iconPath
      })

      notification.show()
      state.tenPercentWarned = true

      return
    }

    if (percent < 20 && !state.twentyPercentWarned) {
      const notification = new Notification({
        title: `You're under 20% of your battery level`,
        body: `You should keep in mind you'll have to charge your battery`,
        icon: iconPath
      })

      notification.show()
      state.twentyPercentWarned = true
    }
  })
}

app.on('ready', () => {
  getBatteryInformation().then(({ hasbattery, percent, ischarging }) => {
    const iconName = getBatteryImage(hasbattery, percent, ischarging)
    const iconPath = path.join(`${__dirname}/battery-icon`, iconName)
    const iconWhitePath = path.join(`${__dirname}/battery-icon/white`, iconName)

    win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: iconPath,
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
    setInterval(() => monitorBattery(), intervalTrayIcon)

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
