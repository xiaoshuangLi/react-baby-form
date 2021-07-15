import React, {
  Children,
  isValidElement,
  cloneElement,
} from 'react';

/**
 * childProps
{
  _ignore: false, ignore this node
  _stop: false, stop recursive this node children
  _error: false, save errors to props

  errors: [],

  _name: '', // 字段 => name
  _title: '', // 字段名 => 名字
  _triggerAttr: 'onChange',
  _valueAttr: 'value',

  _maxLength: undefined, Number
  _minLength: undefined, Number
  _max: undefined, Number
  _min: undefined, Number
  _required: undefined, Bool
  _pattern: undefined, Reg
  _fn: undefined, func, () => Bool
}
 */

const childPropsKeys = [
  '_ignore',
  '_stop',
  '_error',
  '_name',
  '_title',
  '_triggerAttr',
  '_valueAttr',
  '_maxLength',
  '_minLength',
  '_max',
  '_min',
  '_required',
  '_pattern',
  '_fn',
  '_warning',
];

export const getNeatProps = (props = {}) => {
  const keys = Object.keys(props);

  return keys.reduce((res = {}, key) => {
    if (!childPropsKeys.includes(key)) {
      res[key] = props[key];
    }

    return res;
  }, {});
};

export const getNeatElement = (element = {}) => {
  const {
    key,
    ref,
    type: Comp,
    props = {},
  } = element;

  const neatProps = getNeatProps(props);

  return (
    <Comp
      key={key}
      ref={ref}
      {...neatProps}
    />
  );
};

export const isUsefulName = (name) => {
  if (name) {
    return true;
  }

  return typeof name === 'number';
};

export const isNeat = (child = {}) => {
  const { props = {} } = child;
  const { children, _name } = props;

  const useful = isUsefulName(_name);
  const array = Children.toArray(children) || [];

  if (useful) {
    return false;
  }

  return array.every(isNeat);
};

export const recursiveMap = (children, fn) => Children.map(children, (child = {}) => {
  const valid = isValidElement(child);

  if (!valid) {
    return child;
  }

  const neat = isNeat(child);

  if (neat) {
    return getNeatElement(child);
  }

  const { props = {} } = child;
  const {
    _stop,
    _ignore,
    _name,
    children: propsChildren,
  } = props;

  if (_ignore) {
    return getNeatElement(child);
  }

  if (propsChildren && !_stop) {
    child = cloneElement(child, {
      children: recursiveMap(propsChildren, fn),
    });
  }

  return isUsefulName(_name) ? fn(child) : child;
});

export const recursiveForeach = (children, fn) => Children.forEach(children, (child = {}) => {
  const valid = isValidElement(child);

  if (!valid) {
    return;
  }

  const neat = isNeat(child);

  if (neat) {
    return getNeatElement(child);
  }

  const { props = {} } = child;
  const {
    _stop,
    _ignore,
    _name,
    children: propsChildren,
  } = props;

  if (_ignore) {
    return;
  }

  if (propsChildren && !_stop) {
    recursiveMap(propsChildren, fn);
  }

  return _name === undefined ? child : fn(child);
});

export const mergeArray = (list = []) => list.reduce(
  (res = [], item = []) => [...res, ...item],
  [],
);

export const getCurrentFromRef = (ref) => {
  if (!ref) {
    return ref;
  }

  const { current = ref } = ref;

  return current;
};

export const getDefaultValue = (propsValue, name) => {
  if (propsValue !== undefined) {
    return Array.isArray(propsValue) ? [] : {};
  }

  const list = Array.isArray(name)
    ? name
    : [name];

  const good = list.every(
    (item) => typeof item === 'number',
  );

  return good ? [] : {};
};

const isEventLike = (event) => {
  if (!event) {
    return false;
  }

  const { target } = event;

  if (!target) {
    return false;
  }

  return target.value !== undefined;
};

const getValue = (event) => {
  if (!event) {
    return event;
  }

  const target = event.target === undefined ? event : event.target;
  const value = target.value === undefined ? target : target.value;

  if (target instanceof HTMLElement) {
    return target.type === 'checkbox' ? target.checked : value;
  }

  if (isEventLike(event)) {
    return value;
  }

  return target;
};

export const getValueFromEvent = (event) => {
  if (!event) {
    return event;
  }

  const value = getValue(event);

  return value === undefined
    ? getValue(event.nativeEvent)
    : value;
};
