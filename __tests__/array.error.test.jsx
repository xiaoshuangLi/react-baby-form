import React, { Fragment } from 'react';

import BabyForm from '../src';

import { create } from './utils';

const data = {
  value: [],
  errors: [{
    key: 0,
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: '0 is required',
    }],
  }],
  firstErrors: [{
    condition: true,
    key: 'required',
    message: '0 is required',
  }],
};

const objToKey = (obj = {}, parentKeys = []) => {
  const type = typeof obj;

  if (type !== 'object' || !obj) {
    return `${obj}`;
  }

  const keys = Object.keys(obj).sort(
    (a, b) => a > b ? 1 : -1
  );

  return keys.reduce((res = '', key) => {
    const value = obj[key];
    const nextParentKeys = parentKeys.concat(key);

    const keyStr = nextParentKeys.join('.');
    const valurStr = objToKey(value, nextParentKeys);

    return `${res}${keyStr}=${valurStr}`;
  }, '');
};

const warn = console.warn.bind(console.warn);

beforeAll(() => {
  console.warn = () => {};
});

afterAll(() => {
  console.warn = warn;
});

test('trigger onError when did mount', (done) => {
  const { value, errors } = data;

  const onError = (didMountErrors) => {
    try {
      const a = objToKey(didMountErrors);
      const b = objToKey(errors);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create(
    <BabyForm value={value} onError={onError}>
      <input type="text" _name={0} _required />
    </BabyForm>
  );
});

test('trigger onError by child BabyForm when did mount', (done) => {
  const { value, errors } = data;

  const onError = (didMountErrors) => {
    try {
      const a = objToKey(didMountErrors);
      const b = objToKey(errors);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create(
    <BabyForm value={value} onError={onError}>
      <BabyForm _name={0}>
        <input type="text" _name={0} _required />
      </BabyForm>
    </BabyForm>
  );
});

test('trigger onError when did update', (done) => {
  const { value, errors } = data;

  const onError = (didMountErrors) => {
    try {
      const a = objToKey(didMountErrors);
      const b = objToKey(errors);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create(
    <BabyForm value={value}>
      <input type="text" _name={0} _required />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm value={value} onError={onError}>
      <input type="text" _name={0} _required />
    </BabyForm>
  );
});

test('trigger onError by child BabyForm when did update', (done) => {
  const { value, errors } = data;

  const onError = (didMountErrors) => {
    try {
      const a = objToKey(didMountErrors);
      const b = objToKey(errors);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create(
    <BabyForm value={value}>
      <BabyForm _name={0}>
        <input type="text" _name={0} _required />
      </BabyForm>
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm value={value} onError={onError}>
      <BabyForm _name={0}>
        <input type="text" _name={0} _required />
      </BabyForm>
    </BabyForm>
  );
});

test('get props.errors with defaultProps.errors when did mount', (done) => {
  const { value, firstErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    try {
      const a = objToKey(propsErrors);
      const b = objToKey(firstErrors);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }

    return (
      <input type="text" {...props} />
    );
  };

  Input.defaultProps = {
    errors: [],
  };

  const testRenderer = create(
    <BabyForm value={value}>
      <Input type="text" _name={0} _error _required />
    </BabyForm>
  );
});

test('get props.errors with defaultProps.errors when did update', (done) => {
  const { value, firstErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    if (propsErrors.length) {
      try {
        const a = objToKey(propsErrors);
        const b = objToKey(firstErrors);

        expect(a).toBe(b);
        done();
      } catch (e) {
        done(e);
      }
    }

    return (
      <input type="text" {...props} />
    );
  };

  Input.defaultProps = {
    errors: [],
  };

  const testRenderer = create(
    <BabyForm value={value}>
      <Input type="text" _name={0} />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm value={value}>
      <Input type="text" _name={0} _error _required />
    </BabyForm>
  );
});
