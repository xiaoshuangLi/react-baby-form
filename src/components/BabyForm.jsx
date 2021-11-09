import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useContext,
  useImperativeHandle,
  Fragment,
} from 'react';
import classnames from 'classnames';

import {
  isUsefulName,
  recursiveMap,
  recursiveForeach,
  mergeArray,
  getValueFromEvent,
  getDefaultValue,
} from '../utils';

import {
  ParentContext,
  usePromise,
  useEventCallback,
  useDebounceCallback,
  useIsomorphicLayoutEffect,
} from '../utils/hooks';

import warn from '../utils/warn';
import check from '../utils/check';
import { BABY } from '../utils/constants';

import Baby from './Baby';

const { Provider } = ParentContext;

const useProxy = (props = {}) => {
  const {
    _name,
    value: propsValue,
    onChange: propsOnChange,
  } = props;

  const { getValue, onChange } = useContext(ParentContext);

  const baby = { _name };
  const useful = isUsefulName(_name);
  const initial = useful ? undefined : propsValue;

  const ref = useRef(initial);
  const [state, setState] = useState(ref.current);

  const getter = useEventCallback(() => {
    return useful ? getValue(baby) : ref.current;
  });

  const setter = useEventCallback((value) => {
    if (useful) {
      value = typeof value === 'function'
        ? value(getValue(baby))
        : value;

      onChange && onChange(baby, value);
    } else {
      ref.current = typeof value === 'function'
        ? value(ref.current)
        : value;

      setState(ref.current);
    }
  });

  const onChangeState = useEventCallback(() => {
    if (propsValue === state) {
      return;
    }

    if (useful) {
      return;
    }

    propsOnChange && propsOnChange(state);
  });

  const onChangePropsValue = useEventCallback(() => {
    if (useful) {
      return;
    }

    ref.current = propsValue;
  });

  useMemo(onChangePropsValue, [propsValue]);
  useEffect(onChangeState, [state]);

  return { getter, setter };
};

const BabyForm = React.forwardRef((props = {}, ref) => {
  const {
    className,
    Container,
    warning,
    _stop,
    _name: a,
    [BABY]: b,
    value: propsValue,
    onChange: propsOnChange,
    onError: propsOnError,
    ...others
  } = props;
  const { children } = others;

  const cls = classnames({
    'components-baby-form-render': true,
    [className]: !!className,
  });

  const babiesRef = useRef([]);
  const parent = useContext(ParentContext) || {};
  const { subscribe: parentSubscribe } = parent;

  const [promise, resolve] = usePromise();
  const { getter, setter } = useProxy(props);

  const getValue = useEventCallback((childProps = {}) => {
    const { _name = '' } = childProps;

    const got = getter();

    if (got === undefined) {
      return Array.isArray(_name) ? [] : undefined;
    }

    if (Array.isArray(_name)) {
      return _name.map(
        (item) => got[item],
      );
    }

    return got[_name];
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
      obj = _name.reduce((res = {}, key, index) => {
        return { ...res, [key]: childValue[index] };
      }, {});
    } else {
      obj = { [_name]: childValue };
    }

    setter((prevValue) => {
      const baseValue = getDefaultValue(prevValue, _name);

      return prevValue === undefined
        ? Object.assign(baseValue, obj)
        : Object.assign(baseValue, prevValue, obj);
    });
  });

  const onError = useDebounceCallback(() => {
    submit()
      .then(() => {
        propsOnError && propsOnError();
      })
      .catch((errors) => {
        propsOnError && propsOnError(errors);
      });
  }, 300);

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

  useIsomorphicLayoutEffect(() => {
    return parentSubscribe ? parentSubscribe(submit) : undefined;
  }, [parentSubscribe, submit]);

  useIsomorphicLayoutEffect(() => {
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
      <Baby key={key} ref={childRef} ComponentClasss={type} {...childProps} />
    );
  };

  const renderContent = () => {
    const fragment = !Container || Container === Fragment;

    if (fragment) {
      return recursiveMap(children, renderChild);
    }

    const content = (
      <Container ref={ref} className={cls} {...others} />
    );

    return recursiveMap(content, renderChild);
  };

  return (
    <Provider value={providerValue}>
      { renderContent() }
    </Provider>
  );
});

BabyForm.defaultProps = {
  value: undefined,
  warning: undefined,
  onError: undefined,
  onChange: undefined,
  Container: 'div',
  _name: '',
  _stop: true,
  [BABY]: undefined,
};

export default BabyForm;
