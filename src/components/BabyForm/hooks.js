import {
  useRef,
  useCallback,
  createContext,
} from 'react';

export const ParentContext = createContext({
  onChange: () => {},
});

export const useEventCallback = (fn) => {
  const ref = useRef(fn);

  ref.current = fn;

  return useCallback((...args) => {
    const { current } = ref;

    return current && current(...args);
  }, [ref]);
};
