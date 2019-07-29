import {
  Children,
  isValidElement,
  cloneElement,
} from 'react';

export const recursiveMap = (children, fn) => Children.map(children, (child = {}) => {
  const valid = isValidElement(child);

  if (!valid) {
    return child;
  }

  const { props = {} } = child;
  const { _stop, _ignore, _name, children: propsChildren } = props;

  if (_ignore) {
    return child;
  }

  if (propsChildren && !_stop) {
    child = cloneElement(child, {
      children: recursiveMap(propsChildren, fn),
    });
  }

  return _name === undefined ? child : fn(child);
});

export const recursiveForeach = (children, fn) => Children.forEach(children, (child = {}) => {
  const valid = isValidElement(child);

  if (!valid) {
    return;
  }

  const { props = {} } = child;
  const { _stop, _ignore, _name, children: propsChildren } = props;

  if (_ignore) {
    return;
  }

  if (propsChildren && !_stop) {
    recursiveMap(propsChildren, fn);
  }

  return _name === undefined ? child : fn(child);
});

export function getValueFromEvent(event) {
  if (!event) {
    return event;
  }

  event = event.nativeEvent === undefined ? event : event.nativeEvent;

  const target = event.target === undefined ? event : event.target;
  const value = target.value === undefined ? target : target.value;

  if (target instanceof HTMLElement) {
    return target.type === 'checkbox' ? target.checked : value;
  }

  return target;
}
export default {
  recursiveMap,
  recursiveForeach,
  getValueFromEvent,
};
