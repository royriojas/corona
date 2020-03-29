const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefix = require('autoprefixer');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { resolve } = require('path');
const { defaultBrowserTargets } = require('../resources/browserTargets');
const { getBabelLoaderOptions } = require('./babel-loader-helper');
const baseConfig = require('./base');
const { splitChunks, fileName, nodeEnv = 'development' } = require('./config');

let devtool = 'source-map';
const output = {
  filename: fileName(),
};

const isNodeEnvDev = nodeEnv === 'development';

if (isNodeEnvDev) {
  devtool = 'eval-source-map';
  output.devtoolModuleFilenameTemplate = info => resolve(__dirname, info.absoluteResourcePath);
}

const cfg = merge.smart(baseConfig, {
  mode: isNodeEnvDev ? 'development' : 'production',
  devtool,
  output,

  module: {
    rules: [
      {
        test: /\.js$|\.ts$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          // enable cache-loader only if dev
          (() => (isNodeEnvDev ? { loader: 'cache-loader' } : undefined))(),
          {
            loader: 'babel-loader',
            options: getBabelLoaderOptions({
              id: 'devBuild',
              hot: false,
            }),
          },
        ].filter(l => !!l),
      },
      {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          // enable cache-loader only if dev
          (() => (isNodeEnvDev ? { loader: 'cache-loader' } : undefined))(),
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
                  overrideBrowserslist: isNodeEnvDev ? ['last 2 Chrome version'] : defaultBrowserTargets,
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ].filter(l => !!l),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          // enable cache-loader only if dev
          (() => (isNodeEnvDev ? { loader: 'cache-loader' } : undefined))(),
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
                  overrideBrowserslist: ['last 2 Chrome version'],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: true },
          },
        ].filter(l => !!l),
      },
    ],
  },
  plugins: (() => {
    const { MOBX_DEVTOOLS, WEBPACK_ANALYZE } = process.env;

    const NODE_ENV = isNodeEnvDev ? '"development"' : '"production"';
    const mobx_dev_tools = MOBX_DEVTOOLS === 'true' && isNodeEnvDev ? 'true' : 'false';

    const plugins = [
      new MiniCssExtractPlugin({ filename: fileName('css') }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV,
        },
        __MOBX_DEV_TOOLS__: mobx_dev_tools,
      }),
    ];

    // Specifically for webpack bundle optimizations
    // $ yarn analyze; goto localhost:8888
    if (WEBPACK_ANALYZE === 'true') {
      plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
  })(),

  optimization: {
    splitChunks,
  },
});

module.exports = cfg;
