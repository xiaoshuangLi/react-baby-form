var path = require('path');
var projectFolder = path.resolve(__dirname, '..');

module.exports = {
  context: projectFolder,
  entry: {
    main: [
      './src/index.entry',
    ],
  },
  output: {
    path: path.resolve(projectFolder, './public'),
    publicPath: '/',
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/[name].[hash].js',
  },
  resolve: {
    modules: [
      'node_modules',
    ],
    alias: {
      js: path.resolve(projectFolder, '../src/js'),
      css: path.resolve(projectFolder, '../src/css'),
      img: path.resolve(projectFolder, '../src/img'),
      'example-js': path.resolve(projectFolder, 'src/js'),
      'example-css': path.resolve(projectFolder, 'src/css'),
      'example-img': path.resolve(projectFolder, 'src/img'),
      'react-pure-form': path.resolve(projectFolder, '../src'),
    },
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    strictThisContextOnImports: true,
    rules: [
      {
        test: /^(?!.*(_inline)).*\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /_inline\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'js/[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /_inline\.svg$/i,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'svg-react-loader',
          },
        ],
      },
      {
        test: /^(?!.*(_b|_inline)).*\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'img/[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ],
      },
      {
        test: /_b\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[hash:8].[name].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMapContents: true,
              outputStyle: 'expanded',
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'resolve-url-loader',
          },
          {
            loader: 'postcss-loader',
            options: {},
          },
        ],
      },
    ],
  },
};
