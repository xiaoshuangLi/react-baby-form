var config = require('./webpack.config.js');

var startOrEndWithList = [
  'react',
  'react-dom',
  'prop-types',
  'classnames',
];

var includedList = [
  '@babel',
  'css-loader',
  'style-loader',
];

var externals = [
  (context, request, callback) => {
    var startedOrEnded = startOrEndWithList.some((item = '') => {
      const started = request.startsWith(`${item}/`) || request.startsWith(`~${item}/`);
      const ended = request.endsWith(item) || request.endsWith(`~${item}`);

      return started || ended;
    });

    var included = includedList.some(item => request.includes(item));

    if (startedOrEnded) {
      return callback(null, `commonjs ${request}`);
    }

    callback();
  },
];

config.externals = config.externals || [];
config.externals = config.externals.concat(externals);

config.plugins = config.plugins || [];

module.exports = config;
