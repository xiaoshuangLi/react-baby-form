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

const isValidElements = (elements) => {
  return Array.isArray(elements)
    ? elements.some(isValidElements)
    : isValidElement(elements);
};

export const isNeat = (child = {}) => {
  const { props = {} } = child;
  const {
    _name,
    _stop,
    _ignore,
  } = props;

  const useful = isUsefulName(_name);

  if (_ignore) {
    return true;
  }

  if (useful) {
    return false;
  }

  if (_stop) {
    return true;
  }

  return Object.values(props).every((value) => {
    if (isValidElements(value)) {
      return Children
        .toArray(value)
        .every(isNeat);
    }

    return true;
  });
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
    _name,
    _stop,
    _ignore,
  } = props;

  if (_ignore) {
    return getNeatElement(child);
  }

  if (!_stop) {
    const entries = Object.entries(props);
    const needCloneEntries = entries.filter((entry = []) => {
      const [, value] = entry;
      return isValidElements(value);
    });

    if (needCloneEntries.length) {
      const clonedProps = needCloneEntries.reduce((res = {}, entry) => {
        const [key, value] = entry;

        res[key] = recursiveMap(value, fn);
        return res;
      }, {});

      child = cloneElement(child, clonedProps);
    }
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
    return;
  }

  const { props = {} } = child;
  const {
    _name,
    _stop,
    _ignore,
  } = props;

  if (_ignore) {
    return;
  }

  if (!_stop) {
    Object.values(props).forEach((value) => {
      isValidElements(value) && recursiveMap(value, fn);
    });
  }

  _name === undefined ? child : fn(child);
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
