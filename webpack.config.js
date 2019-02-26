const path = require('path')

module.exports = function (type = "umd", name='es5') {
  return {
    mode: 'production',
    entry: path.resolve(__dirname, './index.js'),
    output: {
      filename: `index.${name}.js`,
      path: path.resolve(__dirname, './lib'),
      libraryTarget:type,
      library: "createUpload"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      ]
    }
  }
}