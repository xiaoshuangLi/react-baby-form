import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import check from './check';
import warn from './warn';

import {
  getNeatProps,
  recursiveMap,
  recursiveForeach,
  getValueFromEvent,
} from './utils';

class BabyForm extends Component {
  static defaultProps = {
    value: {},
    onChange: undefined,
    onError: undefined,
    warning: undefined,
    Container: 'div',
    _stop: true,
  };

  onChange = (...list) => {
    this._changeChild(...list);
    this._checkChild(...list);
  }

  _changeChild(childProps = {}, e) {
    const { _name } = childProps;
    const childValue = getValueFromEvent(e);

    const { value: propsValue = {}, onChange } = this.props;

    let obj;

    if (Array.isArray(_name)) {
      obj = _name.reduce((a, key, index) => {
        return Object.assign({}, a, { [key]: childValue[index] });
      }, {});
    } else {
      obj = { [_name]: childValue };
    }

    const baseValue = Array.isArray(propsValue) ? [] : {};
    const value = Object.assign(baseValue, propsValue, obj);

    onChange && onChange(value);
  }

  _getErrorsWithMessage(childProps = {}, e) {
    const { warning } = this.props;

    const childValue = getValueFromEvent(e);
    const warnFn = warn(warning);

    const errors = check(childValue, childProps);

    return errors.map((error = {}) => {
      const message = warnFn(childValue, error, childProps);

      return Object.assign({}, error, { message });
    });
  }

  _checkChild(childProps = {}, e) {
    const { _name } = childProps;
    const { onError } = this.props;
    const childValue = getValueFromEvent(e);

    const errors = this._getErrorsWithMessage(childProps, e);
    const { length } = errors;

    if (!length) {
      return;
    }

    const obj = {
      errors,
      key: _name,
      value: childValue,
    };

    onError && onError(obj);
  }

  _getValue = (childProps = {}) => {
    const { value: propsValue = {} } = this.props;
    const { _name = '' } = childProps;

    if (Array.isArray(_name)) {
      return _name.map(item => propsValue[item]);
    }

    return propsValue[_name];
  }

  _getTrigger = (childProps = {}) => {
    const { _triggerAttr = 'onChange' } = childProps;

    const baseTrigger = childProps[_triggerAttr];

    const trigger = (...list) => {
      const [e = {}] = list;

      e.stopPropagation && e.stopPropagation();
      baseTrigger && baseTrigger(...list);

      this.onChange(childProps, ...list);
    };

    return trigger;
  }

  _getChildProps = (childProps = {}) => {
    const {
      _triggerAttr = 'onChange',
      _valueAttr = 'value',
      _error = false,
    } = childProps;

    const value = this._getValue(childProps);
    const trigger = this._getTrigger(childProps);
    const errors = this._getErrorsWithMessage(childProps, value);

    const initProps = _error ? { errors } : {};
    const staticProps = Object.assign(initProps, childProps);
    const baseProps = getNeatProps(staticProps);

    const props = Object.assign({}, baseProps, {
      [_triggerAttr]: trigger,
      [_valueAttr]: value,
    });

    return props;
  }

  _setupChild = (child = {}) => {
    const {
      props: childProps = {},
      type: ChildComp,
      ref,
      key,
    } = child;

    const props = this._getChildProps(childProps);

    return (
      <ChildComp
        ref={ref}
        key={key}
        {...props}
        />
    );
  }

  _submit = () => {
    return new Promise((resolve, reject) => {
      const { children, value = {} } = this.props;

      const res = [];

      recursiveForeach(children, (child = {}) => {
        const { props: childProps = {} } = child;
        const { _name } = childProps;

        if (!_name) {
          return;
        }

        const childValue = this._getValue(childProps);
        const childErrors = this._getErrorsWithMessage(childProps, childValue);
        const { length } = childErrors;

        if (!length) {
          return;
        }

        const obj = {
          key: _name,
          value: childValue,
          errors: childErrors,
        };

        res.push(obj);
      });

      res.length ? reject(res) : resolve(value);
    });
  }

  renderChildren() {
    const { children } = this.props;

    return recursiveMap(children, this._setupChild);
  }

  render() {
    const {
      className,
      value,
      onChange,
      onError,
      Container,
      _stop,
      children,
      ...others
    } = this.props;

    const cls = classnames({
      'components-baby-form-render': true,
      [className]: !!className,
    });

    return (
      <Container className={cls} {...others}>
        { this.renderChildren() }
      </Container>
    );
  }
}

const getRefErrorObj = ref => ([
  {
    key: 'ref',
    value: ref,
    errors: [
      { message: 'BabyForm Ref not work' },
    ],
  },
]);

export const submit = (ref) => {
  const { current = ref } = ref;

  if (!current) {
    const obj = getRefErrorObj(ref);

    return Promise.reject(obj);
  }

  return current._submit();
};

export default BabyForm;
