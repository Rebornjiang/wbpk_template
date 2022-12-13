const { merge } = require('webpack-merge')
const { DefinePlugin, DllReferencePlugin } = require('webpack') // DllReferencePlugin 取决于是否要抽取 DLL 库来优化性能
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

// utils
const resolvePath = require('./utils/resolvePath')
const getInjectVar = require('./utils/injectVar')
const getWebpackConfigByMode = require('./utils/getWbpkConfig')
const { DocName } = require('../src/settings')


// common config
const config = (env) => {

  const { inject: injectName, mode } = env
  const isProd = mode === 'production'
  const injectVar = getInjectVar(injectName)

  return {
    entry: resolvePath('src/main.js'),
    output: {
      filename: 'js/[name]_[contenthash:6]_bundle.js',
      path: resolvePath('dist')
    },
    module: {
      rules: [
        {
          test: /.css$/,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
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
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
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
        // 图片相关资源处理
        {
          test: /\.(png|jpe?g|webp)$/i,
          type: 'asset',
          generator: {
            filename: 'img/[hash:6][name][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 4 * 1024
            }
          }

        },
        {
          test: /.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new DefinePlugin({ ...injectVar }),
      new HtmlWebpackPlugin({
        title: DocName,
        template: resolvePath('public/index.html'),

        // favicon.icon 与 index.html 不部署在一起，其路径为： favicon 部署在 web/文件 服务器的 URI
        // 1. FAV_BASE_URL: isProd ? `${injectVar.BASE_URL}/favicon.icon` : ''
        // 2. 在借助于 copy-webpack-plugin 实现资源 copy

        //  index.html 和 favicon.icon 在一起部署，直接使用当前插件自带的功能
        favicon: resolvePath('public/favicon.ico')
      }),

      // dev 做模块热更新，prod 提取独立文件
      new MiniCssExtractPlugin({
        filename: isProd ? 'css/[name]_[contenthash:6].css' : '[name].css',
        chunkFilename: isProd ? '[id].[contenthash:6].css' : "[id].css",
      })
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
  console.log(merge([config(env), getWebpackConfigByMode(mode)]))
  return merge([config(env), getWebpackConfigByMode(mode)])
}
