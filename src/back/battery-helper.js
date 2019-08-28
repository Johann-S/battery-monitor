const path = require('path')
const { Notification } = require('electron')
const si = require('systeminformation')
const Translator = require('./translator')

const translator = new Translator()
const stateWarned = {
  twentyPercent: false,
  tenPercent: false,
  chargingOneHundred: false
}
const batteryStates = {
  alert: 'alert.ico',
  10: '10.ico',
  20: '20.ico',
  30: '30.ico',
  40: '40.ico',
  50: '50.ico',
  60: '60.ico',
  70: '70.ico',
  80: '80.ico',
  90: '90.ico',
  charging: 'charging.ico',
  full: 'full.ico',
  unknown: 'unknown.ico'
}

const getBatteryInformation = () => new Promise(resolve => {
  si.battery(({ hasbattery, ischarging, percent, acconnected }) => resolve({
    hasbattery,
    ischarging,
    percent,
    acconnected
  }))
})

const getBatteryImage = (hasBattery, percent, ischarging) => {
  if (!hasBattery) {
    return batteryStates.unknown
  }

  if (ischarging) {
    return batteryStates.charging
  }

  if (percent < 10) {
    return batteryStates.alert
  }

  if (percent < 20) {
    return batteryStates['10']
  }

  if (percent < 30) {
    return batteryStates['20']
  }

  if (percent < 40) {
    return batteryStates['30']
  }

  if (percent < 50) {
    return batteryStates['40']
  }

  if (percent < 60) {
    return batteryStates['50']
  }

  if (percent < 70) {
    return batteryStates['60']
  }

  if (percent < 80) {
    return batteryStates['70']
  }

  if (percent < 90) {
    return batteryStates['80']
  }

  if (percent < 100) {
    return batteryStates['90']
  }

  return batteryStates.full
}

const monitorBattery = (settings, appTray, win) => {
  getBatteryInformation().then(({ hasbattery, percent, ischarging }) => {
    const iconName = getBatteryImage(hasbattery, percent, ischarging)
    const iconPath = path.join(`${__dirname}/../../icon`, iconName)
    const iconWhitePath = path.join(`${__dirname}/../../icon/white`, iconName)

    appTray.setImage(iconWhitePath)
    appTray.setToolTip(`Battery monitor (${percent}%)`)
    win.setIcon(iconPath)

    if (!hasbattery || !Notification.isSupported()) {
      return
    }

    if (percent > 10 && stateWarned.tenPercent) {
      stateWarned.tenPercentWarned = false
    }

    if (percent > 20 && stateWarned.twentyPercent) {
      stateWarned.twentyPercentWarned = false
    }

    if (ischarging) {
      if (percent < 100) {
        stateWarned.chargingOneHundredPercent = false
      }

      if (percent === 100 && !stateWarned.chargingOneHundredPercent && settings.get('notif-max')) {
        const notification = new Notification({
          title: translator.translate('battery100.title'),
          body: translator.translate('battery100.message'),
          icon: iconWhitePath
        })

        notification.show()
        stateWarned.chargingOneHundredPercent = true
      }

      return
    }

    if (percent < 10 && !stateWarned.tenPercent && settings.get('notif-ten')) {
      const notification = new Notification({
        title: translator.translate('battery10.title'),
        body: translator.translate('battery10.message'),
        icon: iconWhitePath
      })

      notification.show()
      stateWarned.tenPercent = true

      return
    }

    if (percent < 20 && percent > 10 && !stateWarned.twentyPercent && settings.get('notif-twenty')) {
      const notification = new Notification({
        title: translator.translate('battery20.title'),
        body: translator.translate('battery20.message'),
        icon: iconWhitePath
      })

      notification.show()
      stateWarned.twentyPercent = true
    }
  })
}

module.exports = {
  getBatteryInformation,
  getBatteryImage,
  monitorBattery
}
