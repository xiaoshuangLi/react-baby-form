import renderer from 'react-test-renderer';

const base = {
  createNodeMock: (element = {}) => {
    const { type } = element;

    return typeof type === 'string' ? {} : null;
  },
};

export const create = (element, options = {}, ...rest) => {
  options = { ...base, ...options };

  return renderer.create(element, options, ...rest);
};