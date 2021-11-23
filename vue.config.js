// vue.config.js
const public_path = process.env.VUE_APP_PUBLIC_PATH;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const isProd = process.env.NODE_ENV === "production"

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,

  publicPath: process.env.NODE_ENV === 'production'
    ? public_path
    : '/',

  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },

    port: 4040
  },

  filenameHashing: true,
  
  configureWebpack: {
    output: {
      filename: '[name].[hash:8].js'
    },

    // No need for splitting
    optimization: {
      splitChunks: false,
      minimizer: isProd ? [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_console: true
            },
          }
        })
      ] : []
    }
  }
}