const path = require('path')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const publicPath = {
  path: 'http://localhost:9000/'
}

module.exports = {
  entry: {
    app: './src/js/index.js',
    jquery: 'jquery',
    store: './src/js/store.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: publicPath.path
  },

  resolve: {
    alias: {
      store$: path.resolve(__dirname, './src/js/store.js')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: 'env'
            }
          }
        ],
        exclude: /node_modules/
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            }
          ]
        })
      },

      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'stylus-loader'
            }
          ]
        })
      },

    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].css'
    }),

    new HtmlWebpackPlugin({
      hash: true,
      template: './src/index.html'
    }),

    new webpack.ProvidePlugin({
      $: 'jquery'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'jquery',
      filename: 'js/jquery.js',
      minChunks: 2
    }),

    new webpack.ProvidePlugin({
      store: 'store'
    }),
  ],

  devServer: {
    port: 9000,
    open: true,
  }
}