const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const banner = require('./config/banner');
const webpack = require('webpack');

module.exports = {
  mode: 'production',

  entry: {
    index: './src/index.ts',
    'app-p5': './src/app-p5.ts',
  },

  // https://webpack.js.org/configuration/externals/
  externals: {},

  devtool: 'hidden-source-map',

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    compress: true,
    contentBase: path.join(__dirname, 'dist'),
    // host: '0.0.0.0',
    hot: true, // https://webpack.js.org/configuration/dev-server/#devserver-hot
    inline: true,
    port: 9001,
    publicPath: '/', // https://webpack.js.org/configuration/dev-server/#devserver-publicpath-
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),

    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].[hash].css',
    }),

    new HtmlWebpackPlugin({
      title: 'Development index',
      chunks: ['index'],
      filename: path.resolve(__dirname, './dist', 'index.html'),
      template: path.resolve(__dirname, './src/html', 'index.html'),
    }),

    new HtmlWebpackPlugin({
      title: 'Development app-p5',
      chunks: ['app-p5'],
      filename: path.resolve(__dirname, './dist', 'app-p5.html'),
      template: path.resolve(__dirname, './src/html', 'app-p5.html'),
    }),

    new webpack.BannerPlugin({
      banner: banner,
    }),
  ],

  output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath
  },

  optimization: {
    minimize: false,
    minimizer: [
      // https://webpack.js.org/plugins/terser-webpack-plugin
      new TerserWebpackPlugin({
        cache: false,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          warnings: true,
          compress: {
            dead_code: false,
            drop_console: true,
            drop_debugger: false,
            unused: true,
            warnings: true,
          },
          mangle: false,
        },
      }),
    ],
    usedExports: true,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{ loader: 'ts-loader' }],
        exclude: /node_modules/,
      },

      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },

          // Inject CSS into the DOM.
          // https://webpack.js.org/loaders/style-loader/
          // 'style-loader',

          // The css-loader interprets @import and url() like import/require() and will resolve them.
          // https://webpack.js.org/loaders/css-loader
          'css-loader',

          // Loads a Sass/SCSS file and compiles it to CSS.
          // https://webpack.js.org/loaders/sass-loader/
          'sass-loader',
        ],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]?[contenthash]',
              publicPath: '../', // Specifies a custom public path for the target file(s).
            },
          },
        ],
      },

      {
        test: /\.(svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              fallback: 'file-loader',
              limit: 512, // url-loader can return a DataURL if the file is smaller than a byte limit.
              // mimetype,

              // file-loader fallback parameters
              name: 'img/[name].[ext]?[contenthash]',
              publicPath: '../', // Specifies a custom public path for the target file(s).
            },
          },
        ],
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'font/[name].[ext]?[contenthash]',
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  target: 'web', // https://webpack.js.org/configuration/target/
};
