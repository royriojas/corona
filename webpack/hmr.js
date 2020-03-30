const webpack = require('webpack');
const merge = require('webpack-merge');
const { resolve } = require('path');
const WriteFilePlugin = require('write-file-webpack-plugin');

const autoprefix = require('autoprefixer');
const { getBabelLoaderOptions } = require('./babe-loader-helper');

const base = require('./base');
const { splitChunks } = require('./config');

const cfg = merge.strategy({
  entry: 'prepend',
  'module.rules': 'append',
  plugins: 'append',
})(base, {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    corona: ['react-hot-loader/patch', 'webpack-hot-middleware/client?path=/__webpack_hmr'],
  },
  output: {
    publicPath: '/dist/',
    filename: '[name].js',
    devtoolModuleFilenameTemplate: info => resolve(__dirname, info.absoluteResourcePath),
  },
  module: {
    rules: [
      {
        test: /\.js$|\.ts$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'babel-loader',
            options: getBabelLoaderOptions({
              id: 'devBuild',
              hot: true,
              browserTargets: ['last 2 chrome versions'],
            }),
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'cache-loader' },
          { loader: 'style-loader', options: { sourceMap: true } },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                autoprefix({
                  overrideBrowserslist: ['last 2 Chrome versions'],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          { loader: 'cache-loader' },
          { loader: 'style-loader', options: { sourceMap: true } },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              importLoaders: 2,
              localIdentName: '[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                autoprefix({
                  overrideBrowserslist: ['last 2 Chrome versions'],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
      __MOBX_DEV_TOOLS__: process.env.MOBX_DEVTOOLS === 'true' ? 'true' : 'false',
    }),
    new WriteFilePlugin({
      // Write only files that have ".css" extension.
      test: /\.css$/,
      useHashIndex: true,
    }),
  ],
  optimization: {
    splitChunks,
  },
});

module.exports = cfg;
