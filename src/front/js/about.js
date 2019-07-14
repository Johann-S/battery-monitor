import { h, Component } from 'preact'
import hyperx from 'hyperx'

const hx = hyperx(h)

class About extends Component {
  render() {
    return hx`
      <div class="container">
        <div class="row">
          <div class="col-6 pl-0 pr-0"></div>
          <div class="col-6 pl-0 pr-0 text-center"></div>
        </div>
      </div>
    `
  }
}

export default About
