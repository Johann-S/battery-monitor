import { h, Component } from 'preact'
import hyperx from 'hyperx'

const hx = hyperx(h)

class BatteryInformation extends Component {
  getBatteryIcon(hasBattery, percent) {
    if (!hasBattery) {
      return 'mdi-battery-unknown'
    }

    if (percent < 10) {
      return 'mdi-battery-alert'
    }

    if (percent < 20) {
      return 'mdi-battery-10'
    }

    if (percent < 30) {
      return 'mdi-battery-20'
    }

    if (percent < 40) {
      return 'mdi-battery-30'
    }

    if (percent < 50) {
      return 'mdi-battery-40'
    }

    if (percent < 60) {
      return 'mdi-battery-50'
    }

    if (percent < 70) {
      return 'mdi-battery-60'
    }

    if (percent < 80) {
      return 'mdi-battery-70'
    }

    if (percent < 90) {
      return 'mdi-battery-80'
    }

    if (percent < 100) {
      return 'mdi-battery-90'
    }

    return 'mdi-battery'
  }

  render({ data }) {
    if (!data.hasbattery) {
      return hx`
        <div class="alert alert-danger text-center mt-2" role="alert">
          <span class="mdi mdi-24px mdi-battery-unknown align-middle"></span>
          <span class="align-middle">You don't have a battery</span>
        </div>
      `
    }

    return hx`
      <div class="row mt-3">
        <div class="col-4">
          <p>Percent: <strong>${data.percent}</strong></p>
        </div>
        <div class="col-8 text-center">
          <span class="mdi mdi-48px ${this.getBatteryIcon(data.hasbattery, data.percent)} align-middle"></span>
        </div>
      </div>
    `
  }
}

export default BatteryInformation
