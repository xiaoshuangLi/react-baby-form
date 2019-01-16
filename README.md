# react-baby-form

Easy form for react to use.

[Demo](https://codepen.io/xiaoshuang/pen/JwLmPm)

[react-antd-form Demo](https://codepen.io/xiaoshuang/pen/KboGxo), Base on Antd-Design.

## Installation

```sh
npm install --save react-baby-form
```

### Usage

```jsx
import React, { Component, createRef } from 'react';
import BabyForm, { submit } from 'react-baby-form';

class Base extends Components {
  formRef = createRef();

  state = {
    value: {},
  }

  onChangeForm = (value) => {
    this.setState({ value });
  }

  onClickSubmit = () => {
    submit(this.formRef)
      .then(() => console.log('good to go'));
      .catch(errors => console.log('errors', errors));
  }

  renderForm() {
    const { value = {} } = this.state;

    return (
      <Babyform value={value} onChange={this.onChangeForm}>
        <input
          type="text"
          _name="name"
          _title="name"
          _required
          _minLength={6}
          _maxLength={6}
          _pattern={/^[0-9a-zA-Z]*$/g}
          _fn={name => name !== 'Tom'}
          />
        <input
          type="number"
          _name="age"
          _title="age"
          _required
          _min={18}
          _max={100}
          />
      </Babyform>
    );
  }

  renderButton() {
    return (
      <button onClick={this.onClickSubmit}>submit</button>
    );
  }

  render() {
    return (
      <div>
        { this.renderForm() }
        { this.renderButton() }
      </div>
    );
  }
}

```

### API

#### BabyForm

```jsx
{
  value: {}, // PropTypes.Object, value from BabyForm
  warning: {}, // PropTypes.Object, warning message from BabyForm
  Container: 'div', // PropTypes.element, The container for render.
  onChange: () => value. // PropTypes.func, Trigger when value change.
  onError: () => error. // PropTypes.func, Trigger when some children value don't pass, only return one error.
}
```

#### submit

Validate BabyForm and return ```Promise```. Just like this:

```jsx
  ref => new Promise();
```

#### Default warning 

```jsx
{
  maxLength(value, condition, opts) {
    const { _title } = opts;

    return `${_title} too long`;
  },
  minLength(value, condition, opts) {
    const { _title } = opts;

    return `${_title} too short`;
  },
  max(value, condition, opts) {
    const { _title } = opts;

    return `${_title} too big`;
  },
  min(value, condition, opts) {
    const { _title } = opts;

    return `${_title} too small`;
  },
  required(value, condition, opts) {
    const { _title } = opts;

    return `${_title} is required`;
  },
  pattern(value, condition, opts) {
    const { _title } = opts;

    return `${_title} is not in right format`;
  },
  fn(value, condition, opts) {
    const { _title } = opts;

    return `${_title} doesn't work.`;
  },
}
```

#### Error structure

```jsx
{
  key: '', // from '_name',
  value: undefined,
  errors: [
    message: '', // from warning
  ],
}
```

#### Children Props

```jsx
{
  _ignore: false, // PropTypes.bool, ignore this node
  _stop: false, // PropTypes.bool, stop recursive this node children

  _error: false, // PropTypes.bool, save errors to props
  errors: [], // PropTypes.Array, need set _error be true.

  _name: '', // PropTypes.string, attribute in value
  _title: '', // PropTypes.string, to show in error message

  _triggerAttr: 'onChange', // PropTypes.string
  _valueAttr: 'value', // PropTypes.string

  _maxLength: undefined, // PropTypes.number
  _minLength: undefined, // PropTypes.number
  _max: undefined, // PropTypes.number
  _min: undefined, // PropTypes.number
  _required: undefined, // PropTypes.bool
  _pattern: undefined, // RegExp
  _fn: undefined // PropTypes.function, value => PropTypes.bool, validate it anyway you like
}
```
