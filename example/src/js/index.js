import { hydrate } from 'react-dom';

import 'example-css/index.scss';
import Global from './container/global';

hydrate(
  Global,
  document.getElementById('app')
);
