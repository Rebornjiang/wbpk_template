const prodConfig = require('../webpack.prod')
const devConfig = require('../webpack.dev')


function createGetConfigFn() {
  const config = {
    production: prodConfig,
    development: devConfig
  }
  return (mode) => {
    return config[mode] ?? {}
  }
}


module.exports = createGetConfigFn()