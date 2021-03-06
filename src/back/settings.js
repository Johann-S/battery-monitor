const path = require('path')
const fs = require('fs')
const { app } = require('electron')

// Private
let data = {}
let settingsPath

const applySettings = settingsData => {
  app.setLoginItemSettings({ openAtLogin: settingsData['auto-start'] })
}

class Settings {
  constructor () {
    settingsPath = path.join(app.getPath('userData'), `${path.sep}battery-monitor-settings.json`)
    data = fs.existsSync(settingsPath) ? require(settingsPath) : {}
  }

  get (key) {
    return data[key]
  }

  getAll () {
    return data
  }

  set (key, value) {
    data[key] = value
    applySettings(data)
  }

  setAll (settings) {
    data = settings
    applySettings(data)
    fs.writeFileSync(settingsPath, JSON.stringify(data))
  }
}

module.exports = Settings
