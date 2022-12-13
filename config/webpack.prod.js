const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
module.exports = {
  mode: 'production',
  optimization: {
    // `...`,
    minimizer: [new CssMinimizerPlugin({
      // parallel 默认值 os.cpus().length - 1
      // parallel: 4,
    })]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}