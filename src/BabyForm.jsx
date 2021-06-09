import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
  useContext,
  useImperativeHandle,
  Fragment,
} from 'react';
import classnames from 'classnames';

import check from './check';
import warn from './warn';

import {
  isUsefulName,
  getNeatProps,
  recursiveMap,
  recursiveForeach,
  mergeArray,
  getValueFromEvent,
  getCurrentFromRef,
  getDefaultValue,
} from './utils';

import {
  ParentContext,
  usePrevious,
  useEventCallback,
  useDebounceCallback,
  usePromise,
} from './hooks';

const { Provider } = ParentContext;

const Baby = React.forwardRef((props = {}, ref) => {
  const {
    ComponentClasss,
    _valueAttr = 'value',
    _triggerAttr = 'onChange',
    _error = false,
    ...others
  } = props;

  const value = props[_valueAttr];
  const baseTrigger = props[_triggerAttr];

  const [key, setKey] = useState(0);

  const previousValue = usePrevious(value);
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
  const staticProps = { ...others, ...initProps };
  const baseProps = getNeatProps(staticProps);

  const restProps = {
    key,
    ...baseProps,
    [_triggerAttr]: trigger,
  };

  useEffect(() => {
    if (value === undefined && previousValue !== undefined) {
      setKey((prevKey) => prevKey + 1);
    }
  }, [value, previousValue]);

  if ('errors' in others) {
    console.warn('react-baby-form: The "errors" is keywords in props.The value will be overwritten.');
  }

  return (
    <ComponentClasss ref={ref} {...restProps} />
  );
});

const MemoBaby = React.memo(Baby);

const BabyForm = React.forwardRef((props = {}, ref) => {
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

  const [promise, resolve] = usePromise();

  const getValue = useEventCallback((childProps = {}) => {
    const { _name = '' } = childProps;

    if (propsValue === undefined) {
      return Array.isArray(_name) ? [] : undefined;
    }

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

  const submit = useEventCallback(async () => {
    const getChildrenErrors = () => {
      const errors = [];

      recursiveForeach(children, (child = {}) => {
        const { props: childProps = {} } = child;
        const { _name } = childProps;

        const useful = isUsefulName(_name);

        if (!useful) {
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

      const promises = current.map((baby) => {
        return baby()
          .then(() => [])
          .catch((e) => e);
      });

      return Promise.all(promises).then(mergeArray);
    };

    await promise;

    const result = await Promise.all([
      getChildrenErrors(),
      getBabiesErrors(),
    ]);

    const errors = mergeArray(result);

    if (errors.length) {
      throw errors;
    }

    return propsValue;
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

    const baseValue = getDefaultValue(propsValue, _name);
    const value = propsValue === undefined
      ? Object.assign(baseValue, obj)
      : Object.assign(baseValue, propsValue, obj);

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

  const subscribe = useEventCallback((baby) => {
    const { current: babies = [] } = babiesRef;

    babiesRef.current = babies.concat(baby);

    return () => {
      const { current: prevBabies = [] } = babiesRef;

      babiesRef.current = prevBabies.filter(
        (item) => item !== baby,
      );
    };
  });

  const providerValue = useMemo(() => ({
    submit,
    subscribe,
    getValue,
    getErrorsWithMessage,
    onChange,
  }), [submit, subscribe, getValue, getErrorsWithMessage, onChange]);

  useLayoutEffect(() => {
    return parentSubscribe ? parentSubscribe(submit) : undefined;
  }, [parentSubscribe, submit]);

  useLayoutEffect(() => {
    resolve && resolve();
  }, [resolve]);

  useEffect(
    onError,
    [propsValue, onError],
  );

  useImperativeHandle(ref, () => {
    const obj = { submit };

    if (!ref) {
      return obj;
    }

    const { current } = ref;

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

  const renderChildren = () => {
    const fragment = !Container || Container === Fragment;
    const content = recursiveMap(children, renderChild);

    if (fragment) {
      return (
        <>
          { content }
        </>
      );
    }

    return (
      <Container ref={ref} className={cls} {...others}>
        { recursiveMap(children, renderChild) }
      </Container>
    );
  };

  return (
    <Provider value={providerValue}>
      { renderChildren() }
    </Provider>
  );
});

BabyForm.defaultProps = {
  value: undefined,
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
          { message: 'react-baby-form: ref not work' },
        ],
      },
    ];

    return Promise.reject(error);
  }

  return current.submit();
};

export default BabyForm;
