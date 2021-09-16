import React from 'react';

import BabyForm from '../src';

import { create } from './utils';

const Container = (props = {}) => {
  const { title, children } = props;

  return (
    <>
      { title }
      { children }
    </>
  );
};

test('set correct value by _name', () => {
  const value = {
    name: 'xiaoshuang',
    age: '28',
  };

  const title = (
    <input id="name" type="text" _name="name" />
  );

  const testRenderer = create(
    <BabyForm value={value}>
      <Container title={title}>
         <input id="age" type="text" _name="age" />
      </Container>
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

test('set correct value by _name in BabyForm props', () => {
  const value = {
    name: 'xiaoshuang',
    age: '28',
  };

  const title = (
    <input id="name" type="text" _name="name" />
  );

  const testRenderer = create(
    <BabyForm value={value} title={title} Container={Container}>
       <input id="age" type="text" _name="age" />
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
