import React from 'react';
import classnames from 'classnames';

import Base from './Base';
import Boss from './Boss';

const App = (props = {}) => {
  const {
    className,
    children,
    ...others
  } = props;

  const cls = classnames({
    'pages-app-render': true,
    [className]: className,
  });

  return (
    <div className={cls} {...others}>
      <Base />
      <Boss />
    </div>
  );
};

export default App;
