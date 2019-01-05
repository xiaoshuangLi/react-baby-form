import React, { Component, forwardRef } from 'react';
import { withRouter, Router, Switch } from 'react-router';
import { createBrowserHistory } from 'history';
import qs from 'qs';

const qsOpts = { ignoreQueryPrefix: true };

const loadedBundle = new WeakMap();
const compStore = new WeakMap();

class Bundle extends Component {
  state = {
    mod: null,
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps);
    }
  }

  load(props) {
    const { load } = props;

    if (loadedBundle.has(load)) {
      return this.setState({
        mod: loadedBundle.get(load),
      });
    }

    load()
      .then((res = {}) => {
        const mod = res.default ? res.default : res;

        this.setState({ mod });
        loadedBundle.set(load, mod);
      });
  }

  render() {
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}

const getOpts = (opts) => typeof opts === 'string' ? { pathname: opts } : opts;

const getOptsByQuery = (baseOpts = {}) => {
  const opts = getOpts(baseOpts);
  const {
    search: optsSearch,
    query: optsQuery,
    ...others
  } = opts;

  if (!optsSearch && !optsQuery) {
    return baseOpts;
  }

  const query = Object.assign({}, qs.parse(optsSearch, qsOpts), optsQuery);
  const search = qs.stringify(query);

  return Object.assign({}, others, {
    search,
  });
};

const getLocation = (props = {}) => {
  const { location } = props;

  if (location !== undefined) {
    return location;
  }

  if (typeof window === 'undefined') {
    return {};
  }

  return window.location;
}

export const withQuery = Comp => {
  const CompInStore = compStore.get(Comp);

  if (CompInStore) {
    return CompInStore;
  }

  const CompWithQuery = forwardRef((props = {}, ref) => {
    const { history } = props;
    const location = getLocation(props);

    const { search = '' } = location;
    const query = qs.parse(search, qsOpts);

    if (history === undefined) {
      const CompWithRouterAndQuery = withRouter(withQuery(Comp));

      return (
        <CompWithRouterAndQuery
          ref={ref}
          {...props}
          />
      );
    }

    const push = opts => history.push(getOptsByQuery(opts));
    const replace = opts => history.replace(getOptsByQuery(opts));

    return (
      <Comp
        ref={ref}
        query={query}
        push={push}
        replace={replace}
        {...props}
        />
    );
  });

  compStore.set(Comp, CompWithQuery);
  return CompWithQuery;
};

export const withQueryRouter = Comp => forwardRef((props = {}, ref) => {
  const CompWithQuery = withQuery(Comp);
  const history = createBrowserHistory();

  return (
    <Router history={history}>
      <CompWithQuery ref={ref} {...props} />
    </Router>
  );
});

export const renderWithQuery = (Comp, props = {}) => {
  const CompWithQuery = withQuery(Comp);

  return (
    <CompWithQuery {...props} />
  );
}

export const createBundle = load => (props = {}) => {
  const renderComp = Comp => renderWithQuery(Comp, props);

  return (
    <Bundle once load={load}>
      { renderComp }
    </Bundle>
  );
};

export default Bundle;
