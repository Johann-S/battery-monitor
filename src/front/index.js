import { h, render, Component } from 'preact'
import { ipcRenderer } from 'electron'
import hyperx from 'hyperx'
const hx = hyperx(h)
const refreshInterval = 4000

/** Components */
import BatteryInformation from './battery-information'

class App extends Component {
  componentDidMount() {
    this.chkAutoRefreshEl = document.getElementById('chkAutoRefresh')
    this.chkAutoRefreshEl.checked = true
    this.setState({ refreshAuto: true, batteryInfo: undefined })
    this.initAutoRefresh()

    ipcRenderer.on('battery-info', (event, batteryInfo) => this.setState({ batteryInfo }))
    ipcRenderer.send('get-battery-info')
  }

  initAutoRefresh() {
    this.intervalRefresh = setInterval(() => ipcRenderer.send('get-battery-info'), refreshInterval)
  }

  renderBatteryInfo() {
    const { batteryInfo } = this.state

    if (!batteryInfo.hasbattery) {
      if (this.state.refreshAuto) {
        this.changeRefreshAuto()
      }
    }

    return h(BatteryInformation, { data: batteryInfo })
  }

  changeRefreshAuto() {
    this.setState({ refreshAuto: !this.state.refreshAuto })

    if (!this.state.refreshAuto) {
      clearInterval(this.intervalRefresh)
    } else {
      this.initAutoRefresh()
    }

    this.chkAutoRefreshEl.checked = this.state.refreshAuto
  }

  render({}, { batteryInfo }) {
    return hx`
    <div class="container mt-3">
      <div class="row">
        <div class="col-12">
          <div class="custom-control custom-switch d-inline-block" onClick=${() => this.changeRefreshAuto()}>
            <input id="chkAutoRefresh" type="checkbox" class="custom-control-input">
            <label class="custom-control-label align-middle" for="customSwitch1">Refresh auto</label>
          </div>
        </div>
      </div>
      ${!batteryInfo ? '' : this.renderBatteryInfo()}
    </div>
    `
  }
}

render(h(App), document.body)
