import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import homeRoute from 'example-js/container/home/route';

import App from './components/App';
import NotFound from './components/NotFound';

const rootRoute = (
  <App>
    <Switch>
      { homeRoute }
      <Route path="/404" component={NotFound} />
      <Redirect from="/" to="home" />
    </Switch>
  </App>
);

export default rootRoute;
