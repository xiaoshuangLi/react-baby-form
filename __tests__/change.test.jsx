import React from 'react';
import renderer from 'react-test-renderer';

import BabyForm from '../src';

test('trigger onChange when child change', (done) => {
  const value = {};

  const data = {
    name: 'xiaoshuang',
  };

  const onChange = (nextValue) => {
    try {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(data);

      expect(a).toBe(b);
      done();
    } catch(e) {
      done(e);
    }
  };

  const testRenderer = renderer.create(
    <BabyForm value={value} onChange={onChange}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  );

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('trigger onChange from child BabyForm', (done) => {
  const value = {};

  const data = {
    baby: {
      name: 'xiaoshuang',
    },
  };

  const onChange = (nextValue) => {
    try {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(data);

      expect(a).toBe(b);
      done();
    } catch(e) {
      done(e);
    }
  };

  const testRenderer = renderer.create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  );

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('trigger onChange from complex data structure', (done) => {
  const value = [];

  const data = [
    {
      baby: {
        name: 'xiaoshuang',
      },
    }
  ];

  const onChange = (nextValue) => {
    try {
      const a = JSON.stringify(nextValue);
      const b = JSON.stringify(data);

      expect(a).toBe(b);
      done();
    } catch(e) {
      done(e);
    }
  };

  const testRenderer = renderer.create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name={0}>
        <BabyForm _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});
