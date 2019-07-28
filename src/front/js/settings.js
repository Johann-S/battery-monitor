import { h, render, Component } from 'preact'
import { ipcRenderer, remote } from 'electron'
import hyperx from 'hyperx'
import 'bootstrap/js/dist/tab'

/** Components */
import About from './about'

const hx = hyperx(h)

class Settings extends Component {
  componentWillMount () {
    this.translator = remote.getGlobal('translator')
  }

  componentDidMount () {
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

  close () {
    const newSettings = {}

    this.customCtrlInputList.forEach(customCtrlInput => {
      newSettings[customCtrlInput.getAttribute('name')] = customCtrlInput.checked
    })

    ipcRenderer.send('close-settings', newSettings)
  }

  render () {
    return hx`
    <div>
      <div class="d-flex flex-row-reverse">
        <button type="button" class="btn btn-light mt-1 mr-1" onClick=${() => this.close()}>
          <span class="mdi mdi-close"></span>
        </button>
      </div>
      <ul class="nav nav-tabs mt-1 w-95" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="settings-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="home" aria-selected="true">
            ${this.translator.translate('settings')}
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="about-tab" data-toggle="tab" href="#about" role="tab" aria-controls="profile" aria-selected="false">About</a>
        </li>
      </ul>
      <div class="tab-content w-95">
        <div id="settings" class="tab-pane fade mt-4 show active" role="tabpanel" aria-labelledby="settings-tab">
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
        <div id="about" class="tab-pane fade" role="tabpanel" aria-labelledby="about-tab">
        ${h(About)}
        </div>
      </div>
    </div>
    `
  }
}

render(h(Settings), document.body)
