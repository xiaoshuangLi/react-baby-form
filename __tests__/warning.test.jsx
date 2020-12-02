import React, { Fragment } from 'react';

import BabyForm from '../src';

import { create } from './utils';

const getTitleFromOpts = (opts = {}) => {
  const {
    _name,
    _title,
    name,
    title,
  } = opts;

  const nameText = _name || name;
  const titleText = _title || title;

  return titleText || nameText;
};

const data = {
  value: {},
  warning: {
    maxLength(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} too long`;
    },
    minLength(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} too short`;
    },
    max(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} too big`;
    },
    min(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} too small`;
    },
    required(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} is required`;
    },
    pattern(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} is not in right format`;
    },
    fn(value, condition, opts) {
      const text = getTitleFromOpts(opts);

      return `test: ${text} doesn't work.`;
    },
  },
  errors: [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'test: name is required',
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

test('custom warning', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm value={value} onError={onError} warning={warning}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('custom child warning', (done) => {
  const { value, warning, errors } = data;

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
      <input type="text" _name="name" _required _warning={warning} />
    </BabyForm>
  );
});

test('custom child warning in child BabyForm', (done) => {
  const { value, warning, errors } = data;

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
        <input type="text" _name="name" _required _warning={warning} />
      </BabyForm>
    </BabyForm>
  );
});

test('Fragment: custom warning', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm Container={Fragment} value={value} onError={onError} warning={warning}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('Fragment: custom child warning', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm Container={Fragment} value={value} onError={onError}>
      <input type="text" _name="name" _required _warning={warning} />
    </BabyForm>
  );
});

test('Fragment: custom child warning in child BabyForm', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm Container={Fragment} value={value} onError={onError}>
      <BabyForm Container={Fragment} _name="baby">
        <input type="text" _name="name" _required _warning={warning} />
      </BabyForm>
    </BabyForm>
  );
});

test('Fragment(null): custom warning', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm Container={null} value={value} onError={onError} warning={warning}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('Fragment(null): custom child warning', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm Container={null} value={value} onError={onError}>
      <input type="text" _name="name" _required _warning={warning} />
    </BabyForm>
  );
});

test('Fragment(null): custom child warning in child BabyForm', (done) => {
  const { value, warning, errors } = data;

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
    <BabyForm Container={null} value={value} onError={onError}>
      <BabyForm Container={null} _name="baby">
        <input type="text" _name="name" _required _warning={warning} />
      </BabyForm>
    </BabyForm>
  );
});
