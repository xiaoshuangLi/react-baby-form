import React, { Fragment } from 'react';

import BabyForm from '../src';

import { create } from './utils';

test('set correct value by _name', () => {
  const value = ['xiaoshuang', '28'];

  const testRenderer = create(
    <BabyForm value={value}>
      <input id="name" type="text" _name={0} _required />
      <input id="age" type="text" _name={1} />
    </BabyForm>
  );

  const { root } = testRenderer;

  const nameWithCorrectValue = root.find((curr = {}) => {
    const { props: { id, value } = {} } = curr;

    return id === 'name' && value === 'xiaoshuang';
  });

  const ageWithCorrectValue = root.find((curr = {}) => {
    const { props: { id, value } = {} } = curr;

    return id === 'age' && value === '28';
  });

  const correct = !!(nameWithCorrectValue && ageWithCorrectValue);

  expect(correct).toBe(true);
});

test('set correct value by _name in child BabyForm', () => {
  const value = ['28', ['xiaoshuang']];

  const testRenderer = create(
    <BabyForm value={value}>
      <input id="age" type="text" _name={0} />
      <BabyForm _name={1}>
        <input id="name" type="text" _name={0} _required />
      </BabyForm>
    </BabyForm>
  );

  const { root } = testRenderer;

  const nameWithCorrectValue = root.find((curr = {}) => {
    const { props: { id, value } = {} } = curr;

    return id === 'name' && value === 'xiaoshuang';
  });

  const ageWithCorrectValue = root.find((curr = {}) => {
    const { props: { id, value } = {} } = curr;

    return id === 'age' && value === '28';
  });

  const correct = !!(nameWithCorrectValue && ageWithCorrectValue);

  expect(correct).toBe(true);
});

test('set correct value from complex data structure', () => {
  const value = [['28', ['xiaoshuang']]];

  const testRenderer = create(
    <BabyForm value={value}>
      <BabyForm _name={0}>
        <input id="age" type="text" _name={0} />
        <BabyForm _name={1}>
          <input id="name" type="text" _name={0} _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  const { root } = testRenderer;

  const nameWithCorrectValue = root.find((curr = {}) => {
    const { props: { id, value, ComponentClasss } = {} } = curr;

    return id === 'name' && value === 'xiaoshuang' && !ComponentClasss;
  });

  const ageWithCorrectValue = root.find((curr = {}) => {
    const { props: { id, value, ComponentClasss } = {} } = curr;

    return id === 'age' && value === '28' && !ComponentClasss;
  });

  const correct = !!(nameWithCorrectValue && ageWithCorrectValue);

  expect(correct).toBe(true);
});
