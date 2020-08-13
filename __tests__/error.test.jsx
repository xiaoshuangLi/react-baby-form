import React from 'react';

import BabyForm from '../src';

import { create } from './utils';

const data = {
  value: {},
  errors: [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
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
      <input type="text" _name="name" _required />
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
      <BabyForm _name="baby">
        <input type="text" _name="name" _required />
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
      <input type="text" _name="name" _required />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm value={value} onError={onError}>
      <input type="text" _name="name" _required />
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
      <BabyForm _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm value={value} onError={onError}>
      <BabyForm _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );
});
