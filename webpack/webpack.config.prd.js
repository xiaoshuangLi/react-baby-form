var config = require('./webpack.config.js');  sss

const startOrEndWithList = [
  'classnames',
  'lodash',
  'prop-types',
  'react',
  'react-dom',
];

const externals = [
  (context, request, callback) => {
    const startedOrEnded = startOrEndWithList.some((item = '') => {
      const started = request.startsWith(`${item}/`) || request.startsWith(`~${item}/`);
      const ended = request.endsWith(item) || request.endsWith(`~${item}`);

      return started || ended;
    });

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
