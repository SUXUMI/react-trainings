const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  devtool: 'cheap-module-inline-source-map',
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      files: {
        js: ['main.bundle.js']
      }
    })
  ],
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties'],
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
}