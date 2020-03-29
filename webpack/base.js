const { resolve } = require('path');
const webpack = require('webpack');

const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const vendorManifestJson = require('../public/dist/vendor-manifest.json');

const { staticFiles, isMinified } = require('./config');

const minimizer = isMinified
  ? [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i,
          },
          sourceMap: true,
        },
      }),
    ]
  : [];

module.exports = {
  context: resolve('./'),
  cache: true,
  stats: {
    children: false,
  },
  optimization: {
    minimize: isMinified,
    minimizer,
  },
  entry: {
    corona: [resolve('src/frontend/corona/launcher.js')],
  },
  output: {
    path: resolve('./public/dist/'),
  },
  module: {
    rules: [
      {
        test: /resources\/dist\/svg-sprite\.svg/,
        use: [{ loader: 'raw-loader' }],
      },
      {
        test: /\.(png|jpg|gif|ttf|woff|woff2|tff|eot|svg|otf|ico|mp4)$/,
        exclude: fPath => !!fPath.match(/resources\/dist\/svg-sprite\.svg/),
        use: [{ loader: 'file-loader', options: { name: '[path][name].[ext]' } }],
      },
    ],
  },
  resolve: {
    modules: ['frontend', 'node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new CopyWebpackPlugin(staticFiles),
    new CaseSensitivePlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DllReferencePlugin({
      context: resolve(__dirname, '..'),
      manifest: vendorManifestJson,
    }),
  ],
};
