import React, { Fragment } from 'react';

import BabyForm from '../src';

import { create } from './utils';

test('Array: trigger onChange when child change', (done) => {
  const value = [];
  const data = ['xiaoshuang'];

  const onChange = (nextValue) => {
    try {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(data);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm value={value} onChange={onChange}>
      <input id="first" type="text" _name={0} _required />
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'first' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Array: trigger onChange from child BabyForm', (done) => {
  const value = [];
  const data = [['xiaoshuang']];

  const onChange = (nextValue) => {
    try {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(data);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name={0}>
        <input id="first" type="text" _name={0} _required />
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'first' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Array: trigger onChange from complex data structure', (done) => {
  const value = [];
  const data = [[['xiaoshuang']]];

  const onChange = (nextValue) => {
    try {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(data);

      expect(a).toBe(b);
      done();
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name={0}>
        <BabyForm _name={0}>
          <input id="first" type="text" _name={0} _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'first' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});