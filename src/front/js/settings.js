import { h, render, Component } from 'preact'
import { ipcRenderer } from 'electron'
import hyperx from 'hyperx'
const hx = hyperx(h)

class Settings extends Component {
  close() {
    ipcRenderer.send('close-settings')
  }

  render() {
    return hx`
    <div class="h-90">
      <div class="container mt-2">
        <div class="row">
          <div class="col-6 pl-2">
            <h5>Settings</h5>
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
                    <input type="checkbox" class="custom-control-input" id="chkAutoStartApp">
                    <label class="custom-control-label" for="chkAutoStartApp">Auto-start application</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="chkChargeMax">
                    <label class="custom-control-label" for="chkChargeMax">Notify me when I continue to charge my batterie at 100%</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="chkChargeTwenty">
                    <label class="custom-control-label" for="chkChargeTwenty">Notify me when my battery level is under 20%</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <div class="col-sm-12">
                <div class="form-check">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="chkChargeTen">
                    <label class="custom-control-label" for="chkChargeTen">Notify me when my battery level is under 10%</label>
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
