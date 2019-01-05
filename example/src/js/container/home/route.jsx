import React from 'react';

import Bundle from 'example-js/components/Bundle';
import RelativeRouter from 'example-js/components/RelativeRouter';

const createBundle = load => props => (
  <Bundle once load={load}>
    {Comp => <Comp {...props} />}
  </Bundle>
);

const routes = [
  {
    exact: true,
    component: createBundle(() => import('./pages/Base')),
  },
];

const rootRoute = (
  <RelativeRouter path="/home" routes={routes} />
);

export default rootRoute;
