/**
 * @license Copyright 2020 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Webpack core config
 * @author mbordihn@google.com (Markus Bordihn)
 */

import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import JsonMinimizerPlugin from 'json-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { DefinePlugin } from 'webpack';
import { version } from '../package.json';

module.exports = (mode = 'development') => ({
  mode: mode == 'deploy' ? 'production' : mode,
  target: 'web',
  performance: {
    hints: mode == 'deploy' || mode == 'production' ? false : 'warning',
    maxAssetSize: mode == 'development' ? 4096000 : 250000,
    maxEntrypointSize: mode == 'development' ? 1000000 : 250000,
  },
  devServer: {
    compress: true,
    headers: {
      'Cache-Control': 'max-age=0',
      'X-Mode': mode,
    },
    liveReload: mode == 'development',
    open: mode == 'development',
    static: path.join(__dirname, '..', 'static'),
    client: {
      overlay: {
        errors: mode != 'production',
        warnings: false,
      },
    },
  },
  entry: {
    app: ['./src/components/App/index.js', './assets/css/app.css'],
    cacheServiceWorker: ['./src/service-worker/cache-service-worker.js'],
    previewServiceWorker: ['./src/service-worker/preview-service-worker.js'],
    serviceWorker: ['./src/service-worker/service-worker.js'],
  },
  output: {
    publicPath: mode == 'deploy' ? '/coding-with-chrome/' : '/',
    path: path.join(__dirname, '..', 'dist'),
    filename: (pathData) => {
      // Exclude service workers from hashing.
      if (pathData.chunk.name === 'cacheServiceWorker') {
        return 'cache-service-worker.js';
      } else if (pathData.chunk.name === 'previewServiceWorker') {
        return 'preview-service-worker.js';
      }
      return mode == 'development'
        ? 'js/[name].js'
        : 'js/[name].[contenthash].js';
    },
  },
  devtool: mode == 'development' ? 'inline-source-map' : false,
  resolve: {
    symlinks: false,
  },
  module: {
    rules: [
      {
        test: /(phaser-ce\.min\.js$|phaser\.min\.js$|phaser_extras\.min\.js$)/,
        type: 'asset/source',
      },
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '..', 'src'),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: { auto: true },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.[jt]sx?$/,
        use: ['babel-loader', '@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(json|xml)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      exclude: /.map$/,
      deleteOriginalAssets: 'keep-source-map',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './assets/favicon',
          to: './favicon',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/favicon/browserconfig.xml',
          to: './browserconfig.xml',
        },
        {
          from: './assets/logo',
          to: './assets/logo',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/icons',
          to: './assets/icons',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './node_modules/blockly/media',
          to: './assets/blockly',
          globOptions: {
            dot: true,
            gitignore: false,
          },
        },
        {
          from: './assets/blockly',
          to: './assets/blockly',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/examples',
          to: './assets/examples',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './assets/phaser',
          to: './assets/phaser',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './locales',
          to: './locales',
          globOptions: {
            dot: true,
            gitignore: true,
          },
        },
        {
          from: './src/manifest.json',
          to: './manifest.json',
        },
        {
          from: './node_modules/phaser/dist/phaser.min.js',
          to: './framework/phaser.min.js',
        },
        {
          from: './src/frameworks/phaser/phaser_extras.min.js',
          to: './framework/phaser_extras.min.js',
        },
        {
          from: './src/frameworks/phaser/phaser_helper.min.js',
          to: './framework/phaser_helper.min.js',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'Coding with Chrome',
      template: './src/index.html',
      favicon: 'assets/favicon/favicon.ico',
      inject: false,
      enforce: 'post',
    }),
    new DefinePlugin({
      VERSION: JSON.stringify(version),
    }),
  ],
  optimization: {
    emitOnErrors: true,
    runtimeChunk: {
      name: (entrypoint) => {
        if (entrypoint.name == 'app') {
          return `runtime-${entrypoint.name}`;
        }
        return null;
      },
    },
    splitChunks: {
      chunks(chunk) {
        return chunk?.name == 'app';
      },
    },
    minimize: mode != 'development',
    minimizer: [
      new CssMinimizerPlugin(),
      new HtmlMinimizerPlugin(),
      new JsonMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
});
