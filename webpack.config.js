const path = require('path')

module.exports = {
  entry: {
    main: './src/front/js/index.js',
    settings: './src/front/js/settings.js'
  },
  target: 'electron-renderer',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'app/dist'),
    filename: '[name].js'
  }
}
