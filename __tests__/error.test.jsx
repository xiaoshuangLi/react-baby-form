import React, { Fragment } from 'react';

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
  nameErrors: [{
    condition: true,
    key: 'required',
    message: 'name is required',
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

test('get props.errors with defaultProps.errors when did mount', (done) => {
  const { value, nameErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    try {
      const a = objToKey(propsErrors);
      const b = objToKey(nameErrors);

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
      <Input type="text" _name="name" _error _required />
    </BabyForm>
  );
});

test('get props.errors with defaultProps.errors when did update', (done) => {
  const { value, nameErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    if (propsErrors.length) {
      try {
        const a = objToKey(propsErrors);
        const b = objToKey(nameErrors);

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
      <Input type="text" _name="name" />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm value={value}>
      <Input type="text" _name="name" _error _required />
    </BabyForm>
  );
});

test('Fragment: trigger onError when did mount', (done) => {
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
    <BabyForm Container={Fragment} value={value} onError={onError}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('Fragment: trigger onError by child BabyForm when did mount', (done) => {
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
    <BabyForm Container={Fragment} value={value} onError={onError}>
      <BabyForm Container={Fragment} _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );
});

test('Fragment: trigger onError when did update', (done) => {
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
    <BabyForm Container={Fragment} value={value}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm Container={Fragment} value={value} onError={onError}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('Fragment: trigger onError by child BabyForm when did update', (done) => {
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
    <BabyForm Container={Fragment} value={value}>
      <BabyForm Container={Fragment} _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm Container={Fragment} value={value} onError={onError}>
      <BabyForm Container={Fragment} _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );
});

test('Fragment: get props.errors with defaultProps.errors when did mount', (done) => {
  const { value, nameErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    try {
      const a = objToKey(propsErrors);
      const b = objToKey(nameErrors);

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
    <BabyForm Container={Fragment} value={value}>
      <Input type="text" _name="name" _error _required />
    </BabyForm>
  );
});

test('Fragment: get props.errors with defaultProps.errors when did update', (done) => {
  const { value, nameErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    if (propsErrors.length) {
      try {
        const a = objToKey(propsErrors);
        const b = objToKey(nameErrors);

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
    <BabyForm Container={Fragment} value={value}>
      <Input type="text" _name="name" />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm Container={Fragment} value={value}>
      <Input type="text" _name="name" _error _required />
    </BabyForm>
  );
});

test('Fragment(null): trigger onError when did mount', (done) => {
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
    <BabyForm Container={null} value={value} onError={onError}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('Fragment(null): trigger onError by child BabyForm when did mount', (done) => {
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
    <BabyForm Container={null} value={value} onError={onError}>
      <BabyForm Container={null} _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );
});

test('Fragment(null): trigger onError when did update', (done) => {
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
    <BabyForm Container={null} value={value}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm Container={null} value={value} onError={onError}>
      <input type="text" _name="name" _required />
    </BabyForm>
  );
});

test('Fragment(null): trigger onError by child BabyForm when did update', (done) => {
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
    <BabyForm Container={null} value={value}>
      <BabyForm Container={null} _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm Container={null} value={value} onError={onError}>
      <BabyForm Container={null} _name="baby">
        <input type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );
});

test('Fragment(null): get props.errors with defaultProps.errors when did mount', (done) => {
  const { value, nameErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    try {
      const a = objToKey(propsErrors);
      const b = objToKey(nameErrors);

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
    <BabyForm Container={null} value={value}>
      <Input type="text" _name="name" _error _required />
    </BabyForm>
  );
});

test('Fragment(null): get props.errors with defaultProps.errors when did update', (done) => {
  const { value, nameErrors } = data;

  const Input = (props = {}) => {
    const { errors: propsErrors = [] } = props;

    if (propsErrors.length) {
      try {
        const a = objToKey(propsErrors);
        const b = objToKey(nameErrors);

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
    <BabyForm Container={null} value={value}>
      <Input type="text" _name="name" />
    </BabyForm>
  );

  testRenderer.update(
    <BabyForm Container={null} value={value}>
      <Input type="text" _name="name" _error _required />
    </BabyForm>
  );
});
