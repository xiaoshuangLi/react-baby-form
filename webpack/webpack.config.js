var path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
var { CleanWebpackPlugin } = require('clean-webpack-plugin');

var projectFolder = path.resolve(__dirname, '../');
var outputPath = path.resolve(projectFolder, '../lib');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  context: projectFolder,
  entry: {
    main: [
      path.resolve(projectFolder, 'src/index'),
    ],
  },
  output: {
    path: path.resolve(projectFolder, 'lib'),
    publicPath: '/',
    filename: 'index.js',
    library: {
      root: 'ReactBabyForm',
      amd: 'ReactBabyForm',
      commonjs: 'react-baby-form',
    },
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.scss'],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, '../postcss-config.js'),
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};
