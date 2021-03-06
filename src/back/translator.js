const path = require('path')
const { app } = require('electron')

// Private
let data = {}
let currentLang
const supportedLang = ['en', 'fr']

class Translator {
  constructor () {
    currentLang = app.getLocale()

    if (!supportedLang.includes(currentLang)) {
      currentLang = supportedLang[0]
    }

    const localPath = path.join(`${__dirname}/../../locales`, `${currentLang}.json`)

    data = require(localPath)
  }

  translate (key) {
    const splittedKey = key.split('.')

    if (!data[splittedKey[0]]) {
      return key
    }

    if (typeof data[splittedKey[0]] === 'string') {
      return data[splittedKey[0]]
    } else {
      if (typeof data[splittedKey[0]][splittedKey[1]] === 'string') {
        return data[splittedKey[0]][splittedKey[1]]
      }

      return key
    }
  }

  getCurrentLang () {
    return currentLang
  }
}

module.exports = Translator
