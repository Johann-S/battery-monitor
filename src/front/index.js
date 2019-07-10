const { h, render, Component } = require('preact')
const { ipcRenderer } = require('electron')
const hyperx = require('hyperx')
const hx = hyperx(h)
const refreshInterval = 4000

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

      return hx`
      <div class="alert alert-danger text-center mt-2" role="alert">
        <span class="mdi mdi-24px mdi-battery-unknown align-middle"></span>
        <span class="align-middle">You don't have a battery</span>
      </div>
      `
    }

    return hx`
      <p>${batteryInfo.percent}</p>
    `
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
      <div class="custom-control custom-switch d-inline-block" onClick=${() => this.changeRefreshAuto()}>
        <input id="chkAutoRefresh" type="checkbox" class="custom-control-input">
        <label class="custom-control-label align-middle" for="customSwitch1">Refresh auto</label>
      </div>
      ${!batteryInfo ? '' : this.renderBatteryInfo()}
    </div>
    `
  }
}

render(h(App), document.body)
