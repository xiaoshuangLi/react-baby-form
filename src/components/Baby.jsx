import React, {
  useState,
  useEffect,
  useContext,
} from 'react';

import { getNeatProps } from '../utils';

import {
  ParentContext,
  usePrevious,
  useEventCallback,
} from '../utils/hooks';

import { BABY } from '../utils/constants';

const Baby = React.forwardRef((props = {}, ref) => {
  const {
    ComponentClasss,
    _name,
    _valueAttr = 'value',
    _triggerAttr = 'onChange',
    _error = false,
    ...others
  } = props;

  const value = props[_valueAttr];
  const baseTrigger = props[_triggerAttr];

  const [key, setKey] = useState(0);

  const isUndefined = value === undefined;
  const isPreviousUndefined = usePrevious(isUndefined);

  const parent = useContext(ParentContext) || {};
  const { getErrorsWithMessage, onChange } = parent;

  const errors = getErrorsWithMessage(props, value);

  const trigger = useEventCallback((...list) => {
    const [e] = list;

    e && e.stopPropagation && e.stopPropagation();

    onChange(props, ...list);
    baseTrigger && baseTrigger(...list);
  });

  const initProps = _error ? { errors } : {};
  const staticProps = { ...others, ...initProps };
  const baseProps = getNeatProps(staticProps);

  const restProps = {
    key,
    ...baseProps,
    [_triggerAttr]: trigger,
  };

  if (BABY in others) {
    restProps._name = _name;
  }

  useEffect(() => {
    if (isUndefined && isPreviousUndefined === false) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [isUndefined, isPreviousUndefined]);

  if ('errors' in others) {
    console.warn('react-baby-form: The "errors" is keywords in props.The value will be overwritten.');
  }

  return (
    <ComponentClasss ref={ref} {...restProps} />
  );
});

export default React.memo(Baby);
