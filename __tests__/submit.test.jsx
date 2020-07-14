import React from 'react';
import renderer from 'react-test-renderer';

import BabyForm, { submit } from '../src';

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

test('submit(ref) with no errors', async () => {
  const value = { name: 'xiaoshaung' };
  const ref = { current: null };

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  );

  const res = await submit(ref);
  const a = JSON.stringify(res);
  const b = JSON.stringify(value);

  expect(a).toBe(b);
});

test('submit(ref) with no errors and child BabyForm', async () => {
  const value = { baby: { name: 'xiaoshaung' } };
  const ref = { current: null };

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  const res = await submit(ref);
  const a = JSON.stringify(res);
  const b = JSON.stringify(value);

  expect(a).toBe(b);
});

test('submit(ref) with no errors and complex data structure', async () => {
  const value = [{ baby: { name: 'xiaoshaung' } }];
  const ref = { current: null };

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name={0}>
        <BabyForm _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  const res = await submit(ref);
  const a = JSON.stringify(res);
  const b = JSON.stringify(value);

  expect(a).toBe(b);
});

test('submit(ref) with errors', async () => {
  const value = { name: '' };
  const ref = { current: null };
  const errors = [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
  }];

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  );

  try {
    await submit(ref);
  } catch (e) {
    const a = objToKey(e);
    const b = objToKey(errors);

    expect(a).toBe(b);
  }
});

test('submit(ref) with errors and child BabyForm', async () => {
  const value = { baby: { name: '' } };
  const ref = { current: null };
  const errors = [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
  }];

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  try {
    await submit(ref);
  } catch (e) {
    const a = objToKey(e);
    const b = objToKey(errors);

    expect(a).toBe(b);
  }
});

test('submit(ref) with errors  and complex data structure', async () => {
  const value = [{ baby: { name: '' } }];
  const ref = { current: null };
  const errors = [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
  }];

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name={0}>
        <BabyForm _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  try {
    await submit(ref);
  } catch (e) {
    const a = objToKey(e);
    const b = objToKey(errors);

    expect(a).toBe(b);
  }
});

test('ref.current.submit() with no errors', async () => {
  const value = { name: 'xiaoshaung' };
  const ref = { current: null };

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  );

  const res = await ref.current.submit();
  const a = JSON.stringify(res);
  const b = JSON.stringify(value);

  expect(a).toBe(b);
});

test('ref.current.submit() with no errors and child BabyForm', async () => {
  const value = { baby: { name: 'xiaoshaung' } };
  const ref = { current: null };

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  const res = await ref.current.submit();
  const a = JSON.stringify(res);
  const b = JSON.stringify(value);

  expect(a).toBe(b);
});

test('ref.current.submit() with no errors and complex data structure', async () => {
  const value = [{ baby: { name: 'xiaoshaung' } }];
  const ref = { current: null };

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name={0}>
        <BabyForm _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  const res = await ref.current.submit();
  const a = JSON.stringify(res);
  const b = JSON.stringify(value);

  expect(a).toBe(b);
});

test('ref.current.submit() with errors', async () => {
  const value = { name: '' };
  const ref = { current: null };
  const errors = [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
  }];

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  );

  try {
    await ref.current.submit();
  } catch (e) {
    const a = objToKey(e);
    const b = objToKey(errors);

    expect(a).toBe(b);
  }
});

test('ref.current.submit() with errors and child BabyForm', async () => {
  const value = { baby: { name: '' } };
  const ref = { current: null };
  const errors = [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
  }];

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  try {
    await ref.current.submit();
  } catch (e) {
    const a = objToKey(e);
    const b = objToKey(errors);

    expect(a).toBe(b);
  }
});

test('ref.current.submit() with errors  and complex data structure', async () => {
  const value = [{ baby: { name: '' } }];
  const ref = { current: null };
  const errors = [{
    key: 'name',
    value: '',
    errors: [{
      condition: true,
      key: 'required',
      message: 'name is required',
    }],
  }];

  const testRenderer = renderer.create(
    <BabyForm value={value} ref={ref}>
      <BabyForm _name={0}>
        <BabyForm _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  try {
    await ref.current.submit();
  } catch (e) {
    const a = objToKey(e);
    const b = objToKey(errors);

    expect(a).toBe(b);
  }
});
