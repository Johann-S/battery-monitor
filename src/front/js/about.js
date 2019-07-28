import { h, Component } from 'preact'
import { shell } from 'electron'
import hyperx from 'hyperx'

const hx = hyperx(h)
const { productName, version, author } = require('../../../package.json')

class About extends Component {
  openWebsite(ev) {
    ev.preventDefault()
    shell.openExternal(author.url)
  }

  render() {
    return hx`
      <div class="container">
        <div class="row">
          <div class="col-6 text-center pl-0 pr-0">
            <div id="batteryPreview" class="mdi mdi-battery-charging align-middle"></div>
          </div>
          <div class="col-6 pl-0 pr-0 mt-3 align-middle text-center">
            <h4>${productName}</h4>
            <h5>v${version}</h5>
            <p>
              <span>Made with</span>
              <span class="mdi mdi-heart danger"></span>
              <span>by <a href="#" class="text-decoration-none" onClick=${ev => this.openWebsite(ev)}>${author.name}</a></span>
            </p>
            <hr />
            <p class="mb-0">
              <span>
                <span class="mdi mdi-at"></span>
                <a class="text-decoration-none" href="mailto:${author.email}">${author.email}</a>
              </span>
            </p>
            <p>
              <span>
                <span class="mdi mdi-link"></span>
                <a href="#" class="text-decoration-none" onClick=${ev => this.openWebsite(ev)}>${author.url}</a>
              </span>
            </p>
          </div>
        </div>
      </div>
    `
  }
}

export default About
