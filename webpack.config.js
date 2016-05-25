var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.join(__dirname, 'src'),
  devtool: 'cheap-source-map',
  entry: {
    app: './app.js',
    statMap: './stat-map.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'},
      {test: /\.scss$/, loaders: ['style', 'css', 'sass']}
    ]
  },
  devServer: {
    contentBase: './build'
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'Map Test', template: 'index.html'})
  ]
};
