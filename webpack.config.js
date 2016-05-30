const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: 'cheap-source-map',
  entry: {
    app: './app.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' },
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
    ],
  },
  devServer: {
    contentBase: './build',
    proxy: {
      '/api/v1/*': {
        target: 'http://localhost:8000',
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Map Test', template: 'html/index.html' }),
  ],
};
