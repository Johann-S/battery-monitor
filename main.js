const { app, BrowserWindow, ipcMain, Tray, Menu, Notification } = require('electron')
const path = require('path')
const { getBatteryInformation, getBatteryImage } = require('./src/back/battery-helper')
const intervalTrayIcon = 10000

let appTray
let win

const monitorBattery = () => {
  getBatteryInformation().then(({ hasbattery, percent }) => {
    const iconName = getBatteryImage(hasbattery, percent)
    const iconPath = path.join(`${__dirname}/battery-icon`, iconName)

    appTray.setImage(iconPath)
    win.setIcon(iconPath)

    if (!hasbattery || !Notification.isSupported()) {
      return
    }

    if (percent < 10) {
      const notification = new Notification({
        title: `You're under 10% of your battery level`,
        body: 'You should charge your battery as soon as possible',
        icon: iconPath
      })

      notification.show()
    }

    if (percent < 20) {
      const notification = new Notification({
        title: `You're under 20% of your battery level`,
        body: `You should keep in mind you'll have to charge your battery`,
        icon: iconPath
      })

      notification.show()
    }
  })
}

app.on('ready', () => {
  getBatteryInformation().then(({ hasbattery, percent }) => {
    const iconName = getBatteryImage(hasbattery, percent)
    const iconPath = path.join(`${__dirname}/battery-icon`, iconName)
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

    appTray = new Tray(iconPath)
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
