const { merge } = require('webpack-merge')
const { DefinePlugin, DllReferencePlugin } = require('webpack') // DllReferencePlugin 取决于是否要抽取 DLL 库来优化性能

// utils
const resolvePath = require('./utils/resolvePath')
const getInjectVar = require('./utils/injectVar')
const getWebpackConfigByMode = require('./utils/getWbpkConfig')


// common config
const config = (env) => {

  const { inject: injectName, mode } = env
  const isProd = mode === 'production'
  const injectVar = getInjectVar(injectName)

  return {
    entry: resolvePath('src/main.js'),
    output: {
      filename: 'js/[contenthash:8]_bundle.js'
    },
    module: {
      rules: [
        {
          test: /.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                esModule: false, // webpack 默认以 esm 加载模块，设置为 false，这样 url() 加载资源才能够使用 
              }
            },
            'postcss-loader',
            'less-loader'
          ]
        },
      ]
    },
    plugins: [
      new DefinePlugin({ ...injectVar })
    ],
    resolve: {
      extensions: ['.js', '.ts', '.vue', '.json'],
      alias: {
        '@': resolvePath('src')
      }
    },

  }
}

// 合并配置
module.exports = (env) => {
  const { mode } = env
  return merge([config(env), getWebpackConfigByMode(mode)])
}
