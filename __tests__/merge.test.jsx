import React, { useEffect } from 'react';

import BabyForm from '../src';

import { create } from './utils';

const CHAR = '@';

const Input = (props = {}) => {
  const { value, onChange } = props;

  useEffect(() => {
    if (value) {
      return;
    }

    onChange && onChange(CHAR);
  }, [value, onChange]);

  return (
    <input type="text" {...props} />
  );
};

const LazyInput = (props = {}) => {
  const { value, onChange } = props;

  useEffect(() => {
    if (value) {
      return;
    }

    setTimeout(() => {
      onChange && onChange(CHAR);
    });
  }, [value, onChange]);

  return (
    <input type="text" {...props} />
  );
};

test('merge change when didMount', (done) => {
  let count = 0;
  let value = [];

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <Input _name={0} />
      <Input _name={1} />
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(1);
    expect(value).toEqual([CHAR, CHAR]);
    done();
  }, 1000);
});

test('merge change when lazy', (done) => {
  let count = 0;
  let value = [];

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <LazyInput _name={0} />
      <LazyInput _name={1} />
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(2);
    expect(value).toEqual([CHAR, CHAR]);
    done();
  }, 1000);
});

test('merge change when someone lazy', (done) => {
  let count = 0;
  let value = [];

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <Input _name={0} />
      <LazyInput _name={1} />
      <Input _name={2} />
      <LazyInput _name={3} />
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(3);
    expect(value).toEqual([CHAR, CHAR, CHAR, CHAR]);
    done();
  }, 1000);
});

test('merge change when someone lazy with complex structure', (done) => {
  let count = 0;
  let value = {};

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="arraies">
        <BabyForm _name={1}>
          <Input _name={0} />
          <LazyInput _name={1} />
          <Input _name={2} />
          <LazyInput _name={3} />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(3);
    expect(value.arraies[1]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    done();
  }, 1000);
});

test('merge change when someone lazy with complex structure and multiple BabyForm', (done) => {
  let count = 0;
  let value = {};

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="arraies">
        <BabyForm _name={0}>
          <Input _name={0} />
          <LazyInput _name={1} />
          <Input _name={2} />
          <LazyInput _name={3} />
        </BabyForm>
        <BabyForm _name={1}>
          <Input _name={0} />
          <LazyInput _name={1} />
          <Input _name={2} />
          <LazyInput _name={3} />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(5);
    expect(value.arraies[0]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    expect(value.arraies[1]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    done();
  }, 1000);
});

test('merge change when someone lazy with complex structure and multiple BabyForm on same attribute', (done) => {
  let count = 0;
  let value = {};

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="arraies">
        <BabyForm _name={1}>
          <Input _name={0} />
          <LazyInput _name={1} />
        </BabyForm>
        <BabyForm _name={1}>
          <Input _name={2} />
          <LazyInput _name={3} />
        </BabyForm>
      </BabyForm>
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(3);
    expect(value.arraies[1]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    done();
  }, 1000);
});

const Baby = (props = {}) => {
  const { names = [], ...others } = props;

  const children = names.map((name, index) => {
    const ComponentClass = index % 2
      ? Input
      : LazyInput;

    return (
      <ComponentClass key={index} _name={name} />
    );
  });

  return (
    <BabyForm {...others}>
      { children }
    </BabyForm>
  );
};

test('merge change when someone lazy with complex structure and multiple children', (done) => {
  let count = 0;
  let value = {};

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="arraies">
        <Baby names={[0, 1, 2, 3]} _name={0} />
        <Baby names={[0, 1, 2, 3]} _name={1} />
      </BabyForm>
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(5);
    expect(value.arraies[0]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    expect(value.arraies[1]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    done();
  }, 1000);
});

test('merge change when someone lazy with complex structure and multiple children on same attribute', (done) => {
  let count = 0;
  let value = {};

  const onChange = (nextValue) => {
    count += 1;
    value = nextValue;
  };

  create(
    <BabyForm value={value} onChange={onChange}>
      <BabyForm _name="arraies">
        <Baby names={[0, 1]} _name={1} />
        <Baby names={[2, 3]} _name={1} />
      </BabyForm>
    </BabyForm>
  );

  setTimeout(() => {
    expect(count).toEqual(6);
    expect(value.arraies[1]).toEqual([CHAR, CHAR, CHAR, CHAR]);
    done();
  }, 1000);
});
