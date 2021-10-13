import React, {
  useState,
  useEffect,
} from 'react';
import classnames from 'classnames';

import BabyForm from 'react-baby-form';

const CHAR = '@';

const Input = React.forwardRef((props = {}, ref) => {
  const { value, onChange } = props;

  useEffect(() => {
    if (value) {
      return;
    }

    onChange && onChange(CHAR);
  }, [value, onChange]);

  return (
    <input ref={ref} type="text" {...props} />
  );
});

const LazyInput = React.forwardRef((props = {}, ref) => {
  const { value, onChange } = props;

  useEffect(() => {
    if (value) {
      return;
    }

    setTimeout(() => {
      onChange && onChange(CHAR);
    }, Math.random() * 1000);
  }, [value, onChange]);

  return (
    <input ref={ref} type="text" {...props} />
  );
});

const Baby = React.forwardRef((props = {}, ref) => {
  const { names = [], ...others } = props;

  const children = names.map((name, index) => {
    const ComponentClass = index % 2
      ? Input
      : LazyInput;

    return (
      <ComponentClass key={index} _name={name} />
    );
  });

  return (
    <BabyForm ref={ref} {...others}>
      { children }
    </BabyForm>
  );
});

const Boss = React.forwardRef((props = {}, ref) => {
  const { className, ...others } = props;

  const cls = classnames({
    'app-boss': true,
    [className]: className,
  });

  const [value, setValue] = useState({});

  const renderBaby = () => {
    return (
      <>
        <BabyForm _name={1}>
          <Input _name={0} />
          <LazyInput _name={1} />
          <Input _name={2} />
        </BabyForm>
        <BabyForm _name={1}>
          <Input _name={3} />
          <LazyInput _name={4} />
          <Input _name={5} />
        </BabyForm>
      </>
    );
  };

  const renderJSON = () => {
    const json = JSON.stringify(value, null, 2);

    return (
      <pre>{ json }</pre>
    );
  };

  return (
    <BabyForm
      ref={ref}
      className={cls}
      value={value}
      onChange={setValue}
      {...others}
    >
      { renderBaby() }
      { renderJSON() }
    </BabyForm>
  );
});

export default Boss;
