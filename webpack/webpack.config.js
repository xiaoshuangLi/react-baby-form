var path = require('path');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');

var projectFolder = path.resolve(__dirname, '../');
var outputPath = path.resolve(projectFolder, '../lib');

module.exports = {
  mode: 'production',
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
  },
  resolve: {
    modules: [
      'src',
      'node_modules',
    ],
    extensions: ['.js', '.jsx', '.scss'],
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
