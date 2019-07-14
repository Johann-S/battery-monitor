import { h, Component } from 'preact'
import { remote } from 'electron'
import hyperx from 'hyperx'
import * as TimeFormat from 'hh-mm-ss'

const hx = hyperx(h)
const refreshInterval = 4000

class BatteryInformation extends Component {
  componentWillMount () {
    this.translator = remote.getGlobal('translator')
    this.setState({
      chargingTime: null,
      dischargingTime: null
    })
    navigator.getBattery()
      .then(({charging, chargingTime, dischargingTime}) => {
        this.updateBatteryTimes(charging, chargingTime, dischargingTime)
      })
  }

  componentDidMount () {
    this.launchAutoRefresh()
  }

  componentWillUpdate () {
    if (this.props.refreshAuto && !this.refreshInterval) {
      this.launchAutoRefresh()
    } else {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
    }
  }

  launchAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      if (document.hidden) {
        return
      }

      navigator.getBattery()
        .then(({charging, chargingTime, dischargingTime}) => {
          this.updateBatteryTimes(charging, chargingTime, dischargingTime)
        })
    }, refreshInterval)
  }

  updateBatteryTimes (charging, chargingTime, dischargingTime) {
    const format = 'hh:mm'
    let time
    let key

    if (charging && chargingTime === Infinity) {
      this.setState({
        chargingTime: `${this.translator.translate('loading')}...`,
      })

      return
    }

    if (!charging && dischargingTime === Infinity) {
      this.setState({
        dischargingTime: `${this.translator.translate('loading')}...`,
      })

      return
    }

    if (charging) {
      time = chargingTime
      key = 'chargingTime'
    } else {
      time = dischargingTime
      key = 'dischargingTime'
    }

    let formattedTime = TimeFormat.fromS(time, format)
    const splittedFormattedTime = formattedTime.split(':')
    formattedTime = `${splittedFormattedTime[0]}h ${splittedFormattedTime[1]}min`

    this.setState({
      [key]: formattedTime
    })
  }

  getBatteryIcon ({ hasbattery, percent, ischarging }) {
    if (!hasbattery) {
      return 'mdi-battery-unknown'
    }

    if (ischarging) {
      return 'mdi-battery-charging success'
    }

    if (percent < 10) {
      return 'mdi-battery-alert danger'
    }

    if (percent < 20) {
      return 'mdi-battery-10 danger'
    }

    if (percent < 30) {
      return 'mdi-battery-20 danger'
    }

    if (percent < 40) {
      return 'mdi-battery-30 warning'
    }

    if (percent < 50) {
      return 'mdi-battery-40 warning'
    }

    if (percent < 60) {
      return 'mdi-battery-50 warning'
    }

    if (percent < 70) {
      return 'mdi-battery-60 success'
    }

    if (percent < 80) {
      return 'mdi-battery-70 success'
    }

    if (percent < 90) {
      return 'mdi-battery-80 success'
    }

    if (percent < 100) {
      return 'mdi-battery-90 success'
    }

    return 'mdi-battery success'
  }

  render ({ data }) {
    if (!data.hasbattery) {
      return hx`
        <div class="alert alert-danger text-center mt-2" role="alert">
          <span class="mdi mdi-24px mdi-battery-unknown align-middle"></span>
          <span class="align-middle">${this.translator.translate('noBattery')}</span>
        </div>
      `
    }

    return hx`
      <div class="row mt-3">
        <div class="col-12 pl-0 pr-0 text-center">
          <div>
            <div>
              <strong>${this.translator.translate(data.ischarging ? 'charging' : 'discharging')}</strong>
            </div>
            <div>
              ${
                data.ischarging
                  ? hx`<span>${this.translator.translate('remainingTime')}: <strong>${this.state.chargingTime}</strong></span>`
                  : hx`<span>${this.translator.translate('remainingTime')}: <strong>${this.state.dischargingTime}</strong></span>`
              }
            </div>
          </div>
          <div id="batteryPreview" class="mdi ${this.getBatteryIcon(data)} align-middle"></div>
          <div>
            <strong>${data.percent}%</strong>
          </div>
        </div>
      </div>
    `
  }
}

export default BatteryInformation
