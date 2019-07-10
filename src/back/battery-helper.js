const si = require('systeminformation')
const batteryStates = {
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

  return batteryStates.full
}

module.exports = {
  getBatteryInformation,
  getBatteryImage,
}
