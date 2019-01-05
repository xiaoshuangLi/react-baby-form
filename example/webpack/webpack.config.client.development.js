import webpack from 'webpack';
import baseConfig from './webpack.config.client';
import appConfig from '../config';

const config = baseConfig({
  mode: 'development',
});

const { main: baseMain } = config.entry;
const restMain = typeof baseMain === 'string' ? [baseMain] : baseMain;

config.devtool = 'source-map';

config.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      BABEL_ENV: JSON.stringify('development/client'),
    },
  }),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin()
);

config.entry.main = [
  `webpack-hot-middleware/client?path=http://${appConfig.webpack.devserver.host}:${appConfig.webpack.devserver.port}/__webpack_hmr`,
  ...restMain,
];

config.output.publicPath = `http://${appConfig.webpack.devserver.host}:${appConfig.webpack.devserver.port}${config.output.publicPath}`;

export default config;
