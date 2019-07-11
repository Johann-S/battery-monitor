import { h, render, Component } from 'preact'
import { ipcRenderer, remote } from 'electron'
import hyperx from 'hyperx'
const hx = hyperx(h)

class Settings extends Component {
  componentWillMount() {
    this.translator = remote.getGlobal('translator')
  }

  componentDidMount() {
    this.customCtrlInputList = document.querySelectorAll('.custom-control-input')

    ipcRenderer.on('settings', (event, settings) => {
      this.customCtrlInputList.forEach(customCtrlInput => {
        if (settings[customCtrlInput.getAttribute('name')]) {
          customCtrlInput.checked = true
        }
      })
    })
    ipcRenderer.send('get-settings')
  }

  close() {
    const newSettings = {}

    this.customCtrlInputList.forEach(customCtrlInput => {
      newSettings[customCtrlInput.getAttribute('name')] = customCtrlInput.checked
    })

    ipcRenderer.send('close-settings', newSettings)
  }

  render() {
    return hx`
    <div class="h-90">
      <div class="container mt-2">
        <div class="row">
          <div class="col-6 pl-2">
            <h5>${this.translator.translate('settings')}</h5>
          </div>
          <div class="col-6 pr-1">
            <button type="button" class="btn btn-light float-right" onClick=${() => this.close()}>
              <span class="mdi mdi-close"></span>
            </button>
          </div>
        </div>
      </div>
      <div class="content justify-content-center">
        <div class="container">
          <form>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" name="auto-start" id="chkAutoStartApp">
                    <label class="custom-control-label" for="chkAutoStartApp">${this.translator.translate('autoStart')}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" name="notif-max" id="chkChargeMax">
                    <label class="custom-control-label" for="chkChargeMax">${this.translator.translate('notifMax')}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" name="notif-twenty" id="chkChargeTwenty">
                    <label class="custom-control-label" for="chkChargeTwenty">${this.translator.translate('notifTwenty')}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" name="notif-ten" id="chkChargeTen">
                    <label class="custom-control-label" for="chkChargeTen">${this.translator.translate('notifTen')}</label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    `
  }
}

render(h(Settings), document.body)
