import React, { Fragment } from 'react';

import BabyForm from '../src';

import { create } from './utils';

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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm value={value} onChange={onChange}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  ));

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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  ));

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
    },
  ];

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
        <BabyForm _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Fragment: trigger onChange when child change', (done) => {
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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm Container={Fragment} value={value} onChange={onChange}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Fragment: trigger onChange from child BabyForm', (done) => {
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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm Container={Fragment} value={value} onChange={onChange}>
      <BabyForm Container={Fragment} _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Fragment: trigger onChange from complex data structure', (done) => {
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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm Container={Fragment} value={value} onChange={onChange}>
      <BabyForm Container={Fragment} _name={0}>
        <BabyForm Container={Fragment} _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Fragment(null): trigger onChange when child change', (done) => {
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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm Container={null} value={value} onChange={onChange}>
      <input id="name" type="text" _name="name" _required />
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Fragment(null): trigger onChange from child BabyForm', (done) => {
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
    } catch (e) {
      done(e);
    }
  };

  const testRenderer = create((
    <BabyForm Container={null} value={value} onChange={onChange}>
      <BabyForm Container={null} _name="baby">
        <input id="name" type="text" _name="name" _required />
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});

test('Fragment(null): trigger onChange from complex data structure', (done) => {
  const value = [];

  const data = [
    {
      baby: {
        name: 'xiaoshuang',
      },
    },
  ];

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
    <BabyForm Container={null} value={value} onChange={onChange}>
      <BabyForm Container={null} _name={0}>
        <BabyForm Container={null} _name="baby">
          <input id="name" type="text" _name="name" _required />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  ));

  const { root } = testRenderer;

  const nameInstance = root.find((curr = {}) => {
    const { props: { id, ComponentClasss } = {} } = curr;

    return id === 'name' && !ComponentClasss;
  });

  nameInstance.props.onChange('xiaoshuang');
});
