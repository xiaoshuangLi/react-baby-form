import {
  useRef,
  useMemo,
  useEffect,
  useCallback,
  createRef,
  createContext,
} from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

export const ParentContext = createContext({
  onChange: () => {},
});

export const useStableRef = (ref) => {
  return useMemo(() => {
    return ref || createRef(null);
  }, [ref]);
};

export const useEventCallback = (fn) => {
  const ref = useRef(fn);

  ref.current = fn;

  return useCallback((...args) => {
    const { current } = ref;

    return current && current(...args);
  }, [ref]);
};

export const usePrevious = (value) => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export const useDebounceCallback = (callback, ...args) => {
  const fn = useEventCallback(callback);

  return useCallback(debounce(fn, ...args), [fn]);
};

export const useThrottleCallback = (callback, ...args) => {
  const fn = useEventCallback(callback);

  return useCallback(throttle(fn, ...args), [fn]);
};
