import { h, Component } from 'preact'
import { remote } from 'electron'
import hyperx from 'hyperx'

const hx = hyperx(h)

class BatteryInformation extends Component {
  componentWillMount () {
    this.translator = remote.getGlobal('translator')
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
          <span>
            <strong>${this.translator.translate(data.ischarging ? 'charging' : 'discharging')}</strong>
          </span>
          <span id="batteryPreview" class="mdi ${this.getBatteryIcon(data)} align-middle"></span>
          <span>
            <strong>${data.percent}%</strong>
          </span>
        </div>
      </div>
    `
  }
}

export default BatteryInformation
