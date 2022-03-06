const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
  entry: {
    'priority-async-queue': './lib/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'PAQ',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
            sourceType: 'unambiguous'
          }
        }
      }
    ]
  },
  plugins: [
    new UnminifiedWebpackPlugin({})
  ]
};