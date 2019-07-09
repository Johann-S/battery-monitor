const { h, render, Component } = require('preact')
const { ipcRenderer } = require('electron')
const hyperx = require('hyperx')
const hx = hyperx(h)
const refreshInterval = 4000

class App extends Component {
  componentDidMount() {
    setInterval(() => ipcRenderer.send('get-battery-info'), refreshInterval)
    ipcRenderer.on('battery-info', (event, batteryInfo) => this.setState({ batteryInfo: batteryInfo }))
    ipcRenderer.send('get-battery-info')
  }

  renderBatteryInfo() {
    return hx`
      <p>${this.state.batteryInfo.percent}</p>
    `
  }

  render({}, { batteryInfo }) {
    return hx`
    <div class="container">
      <h1>Monitoring your batterie</h1>
      ${!batteryInfo ? '' : this.renderBatteryInfo()}
    </div>
    `
  }
}

// render an instance of Clock into <body>:
render(h(App), document.body)
