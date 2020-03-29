const { resolve } = require('path');
const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const { vendor, isMinified, fileName, rmdir } = require('./config');

const minimizer = isMinified
  ? [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: /^\**!|@preserve|@license|@cc_on/i,
          },
        },
      }),
    ]
  : [];

const { NODE_ENV, CLEAN } = process.env;
const isProd = NODE_ENV === 'prod' || NODE_ENV === 'production';
const hasClean = CLEAN === '1' || !isProd;

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: 'source-map',
  entry: {
    vendor,
  },

  output: {
    filename: fileName(),
    path: resolve('./public/dist/'),
    library: '[name]_[hash]',
  },

  optimization: {
    minimizer,
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          minChunks: Infinity,
          name: 'vendors',
          enforce: true,
        },
      },
    },
  },

  plugins: (() => {
    const { WEBPACK_ANALYZE } = process.env;
    const plugins = [
      new webpack.DllPlugin({
        name: '[name]_[hash]',
        path: path.resolve(__dirname, '../public/dist/[name]-manifest.json'),
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ];

    // clean dist folder
    if (hasClean) {
      plugins.push(new CleanWebpackPlugin(rmdir));
    }
    // run webpack-bundle-analyzer
    if (WEBPACK_ANALYZE === 'true') {
      plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
  })(),
};
