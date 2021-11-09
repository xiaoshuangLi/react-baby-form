import {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
  createContext,
} from 'react';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

export const ParentContext = createContext({
  submit: () => Promise.resolve(),
  onChange: () => {},
});

export const useIsomorphicLayoutEffect = typeof window !== 'undefined'
  && typeof window.document !== 'undefined'
  && typeof window.document.createElement !== 'undefined'
  ? useLayoutEffect
  : useEffect;

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

export const usePromise = () => {
  const resolveRef = useRef(() => {});
  const rejectRef = useRef(() => {});

  const [promise] = useState(() => {
    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  });

  return useMemo(() => {
    return [
      promise,
      resolveRef.current,
      rejectRef.current,
    ];
  }, [promise, resolveRef, rejectRef]);
};
