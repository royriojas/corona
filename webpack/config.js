const { resolve } = require('path');
const CleanCSS = require('clean-css');

const babelConfig = require('../babel.config');

const isMinified = process.env.MINIFY === '1';
const minifyExt = isMinified ? '.min' : '';

module.exports = {
  fileName(ext = 'js') {
    return `[name]${minifyExt}.${ext}`;
  },

  babel: babelConfig,

  // entry.vendor
  vendor: ['react', 'react-dom', 'mobx', 'mobx-react', 'classnames'],

  /** PLUGIN OPTS * */

  // CopyWebpackPlugin opts
  staticFiles: [
    {
      from: resolve('src/frontend/static/css/**/*'),
      to: resolve(`public/dist/static/[name]${minifyExt}.[ext]`),
      flatten: true,
      transform: file => new CleanCSS().minify(file).styles,
    },
  ],

  // CleanWebpackPlugin opts
  rmdir: {
    cleanOnceBeforeBuildPatterns: [resolve(__dirname, '../public/dist/**/*')],
  },

  // splitChunks: {
  //   cacheGroups: {
  //     styles: {
  //       name: 'commons',
  //       test: /node_modules(.*)\.(css|less)$|\/frontend\/shared(.*)\.(css|less)$|\/dashboard\/shared(.*)\.(css|less)$/,
  //       chunks: 'all',
  //     },
  //     commons: {
  //       test: /node_modules(.*)\.(js|ts)$|\/frontend\/shared(.*)\.(js|ts)$|\/dashboard\/shared(.*)\.(js|ts)$/,
  //       name: 'commons', // Specify the common bundle's name.
  //       chunks: 'all',
  //     },
  //   },
  // },

  isMinified,
  nodeEnv: process.env.NODE_ENV,
};
