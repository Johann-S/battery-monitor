const si = require('systeminformation')
const batteryStates = {
  alert: 'alert.ico',
  '10': '10.ico',
  '20': '20.ico',
  '30': '30.ico',
  '40': '40.ico',
  '50': '50.ico',
  '60': '60.ico',
  '70': '70.ico',
  '80': '80.ico',
  '90': '90.ico',
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

const getBatteryImage = (hasBattery, percent) => {
  if (!hasBattery) {
    return batteryStates.unknown
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

module.exports = {
  getBatteryInformation,
  getBatteryImage,
}
