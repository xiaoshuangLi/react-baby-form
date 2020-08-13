import React, {
  useRef,
  useMemo,
  useEffect,
  useLayoutEffect,
  useContext,
  useImperativeHandle,
} from 'react';
import classnames from 'classnames';

import check from './check';
import warn from './warn';

import {
  getNeatProps,
  recursiveMap,
  recursiveForeach,
  mergeArray,
  getValueFromEvent,
  getCurrentFromRef,
} from './utils';

import {
  ParentContext,
  useStableRef,
  useEventCallback,
  useDebounceCallback,
} from './hooks';

const { Provider } = ParentContext;

const EMPTY_FN = () => {};

const Baby = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const {
    ComponentClasss,
    _valueAttr = 'value',
    _triggerAttr = 'onChange',
    _error = false,
    ...others
  } = props;

  const value = props[_valueAttr];
  const baseTrigger = props[_triggerAttr];
  const parent = useContext(ParentContext) || {};

  const {
    getErrorsWithMessage,
    onChange,
  } = parent;

  const errors = getErrorsWithMessage(props, value);
  const trigger = useEventCallback((...list) => {
    const [e] = list;

    e && e.stopPropagation && e.stopPropagation();
    baseTrigger && baseTrigger(...list);

    onChange(props, ...list);
  });

  const initProps = _error ? { errors } : {};
  const staticProps = Object.assign(initProps, others);
  const baseProps = getNeatProps(staticProps);

  const restProps = {
    ...baseProps,
    [_triggerAttr]: trigger,
  };

  return (
    <ComponentClasss ref={ref} {...restProps} />
  );
});

const MemoBaby = React.memo(Baby);

const BabyForm = React.forwardRef((props = {}, ref) => {
  ref = useStableRef(ref);

  const {
    className,
    Container,
    children,
    _stop,
    warning,
    value: propsValue,
    onChange: propsOnChange,
    onError: propsOnError,
    ...others
  } = props;

  const cls = classnames({
    'components-baby-form-render': true,
    [className]: !!className,
  });

  const babiesRef = useRef([]);
  const parent = useContext(ParentContext) || {};
  const { subscribe: parentSubscribe } = parent;

  const getValue = useEventCallback((childProps = {}) => {
    const { _name = '' } = childProps;

    if (Array.isArray(_name)) {
      return _name.map(
        (item) => propsValue[item],
      );
    }

    return propsValue[_name];
  });

  const getErrorsWithMessage = useEventCallback((childProps = {}, e) => {
    const { _warning: childWarning = {} } = childProps;

    const mergedWarning = { ...warning, ...childWarning };
    const warnFn = warn(mergedWarning);

    const childValue = getValueFromEvent(e);
    const errors = check(childValue, childProps);

    return errors.map((error = {}) => {
      const message = warnFn(childValue, error, childProps);

      return { ...error, message };
    });
  });

  const submit = useEventCallback(() => {
    const getChildrenErrors = () => {
      const errors = [];

      recursiveForeach(children, (child = {}) => {
        const { props: childProps = {} } = child;
        const { _name } = childProps;

        if (!_name) {
          return;
        }

        const childValue = getValue(childProps);
        const childErrors = getErrorsWithMessage(childProps, childValue);
        const { length } = childErrors;

        if (!length) {
          return;
        }

        const obj = {
          key: _name,
          value: childValue,
          errors: childErrors,
        };

        errors.push(obj);
      });

      return errors;
    };

    const getBabiesErrors = () => {
      const { current = [] } = babiesRef;

      const promises = current.map((item) => {
        const {
          current: {
            submit: itemSubmit = () => Promise.relove(),
          } = {},
        } = item;

        return new Promise((itemReslove) => {
          itemSubmit()
            .then(() => itemReslove([]))
            .catch(itemReslove);
        });
      });

      return Promise.all(promises).then(mergeArray);
    };

    return new Promise((resolve, reject) => {
      const promises = [
        getChildrenErrors(),
        getBabiesErrors(),
      ];

      Promise.all(promises)
        .then(mergeArray)
        .then((errors = []) => {
          errors.length ? reject(errors) : resolve(propsValue);
        });
    });
  });

  const onChange = useEventCallback((childProps = {}, e) => {
    const { _name } = childProps;
    const childValue = getValueFromEvent(e);

    let obj;

    if (Array.isArray(_name)) {
      obj = _name.reduce((a, key, index) => {
        return { ...a, [key]: childValue[index] };
      }, {});
    } else {
      obj = { [_name]: childValue };
    }

    const baseValue = Array.isArray(propsValue) ? [] : {};
    const value = Object.assign(baseValue, propsValue, obj);

    propsOnChange && propsOnChange(value);
  });

  const onError = useDebounceCallback(() => {
    submit()
      .then(() => {
        propsOnError && propsOnError();
      })
      .catch((errors) => {
        propsOnError && propsOnError(errors);
      });
  }, 1000);

  const subscribe = useEventCallback((baby = {}) => {
    const { current: babies = [] } = babiesRef;
    const { current } = baby;

    if (!current) {
      return EMPTY_FN;
    }

    babiesRef.current = babies.concat(baby);

    return () => {
      const { current: prevBabies = [] } = babiesRef;

      babiesRef.current = prevBabies.filter(
        (item) => item !== baby,
      );
    };
  });

  const providerValue = useMemo(() => ({
    subscribe,
    getValue,
    getErrorsWithMessage,
    onChange,
  }), [subscribe, getValue, getErrorsWithMessage, onChange]);

  useLayoutEffect(() => {
    return parentSubscribe ? parentSubscribe(ref) : undefined;
  }, [parentSubscribe, ref]);

  useEffect(onError);

  useImperativeHandle(ref, () => {
    const { current } = ref;
    const obj = { submit };

    return current
      ? Object.assign(current, obj)
      : obj;
  }, [submit, ref]);

  const renderChild = (child = {}) => {
    const {
      key,
      type,
      ref: childRef,
      props: baseChildProps = {},
    } = child;

    const { _valueAttr = 'value' } = baseChildProps;

    const childValue = getValue(baseChildProps);
    const childProps = { ...baseChildProps, [_valueAttr]: childValue };

    return (
      <MemoBaby key={key} ref={childRef} ComponentClasss={type} {...childProps} />
    );
  };

  return (
    <Provider value={providerValue}>
      <Container ref={ref} className={cls} {...others}>
        { recursiveMap(children, renderChild) }
      </Container>
    </Provider>
  );
});

BabyForm.defaultProps = {
  value: {},
  onChange: undefined,
  onError: undefined,
  warning: undefined,
  Container: 'div',
  _stop: true,
};

export const submit = (ref) => {
  const current = getCurrentFromRef(ref);

  if (!current) {
    const error = [
      {
        key: 'ref',
        value: ref,
        errors: [
          { message: 'BabyForm Ref not work' },
        ],
      },
    ];

    return Promise.reject(error);
  }

  return current.submit();
};

export default BabyForm;
