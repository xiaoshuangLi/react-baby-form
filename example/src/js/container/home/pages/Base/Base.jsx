import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import BabyForm, { submit } from 'react-baby-form';

const Item = (props = {}) => {
  const {
    className,
    required,
    title,
    children,
    ...others
  } = props;

  const cls = classnames({
    'base-item': true,
    'base-required': !!required,
    [className]: !!className,
  });

  return (
    <div className={cls}>
      <div className="item-title">{ title }</div>
      <div className="item-children">{ children }</div>
    </div>
  );
};

class Base extends Component {
  formRef = createRef();

  state = {
    value: {},
    errors: [],
  };

  onChangeForm = (value) => {
    this.setState({ value });
  }

  onErrorForm = (error = []) => {
    const errors = [error];

    this.setState({ errors });
  }

  onClickSubmit = () => {
    const fn = errors => this.setState({ errors });

    submit(this.formRef)
      .then(console.log)
      .catch(fn);
  }

  renderForm() {
    const { value = {} } = this.state;
    const { password } = value;

    const fn = repeatedPassword => password === repeatedPassword;

    return (
      <div className="base-form">
        <Item className="form-item" title="name" required>
          <input
            type="text"
            className="item-input"
            _name="name"
            _title="Name"
            _required
            _maxLength={32}
            _pattern={/^[0-9a-zA-Z]*$/g}
            />
        </Item>
        <Item className="form-item" title="password">
          <input
            type="password"
            className="item-input"
            _name="password"
            _title="Password"
            _minLength={6}
            _maxLength={16}
            />
        </Item>
        <Item className="form-item" title="password again">
          <input
            type="password"
            className="item-input"
            _name="repeatedPassword"
            _title="Repeated password"
            _fn={fn}
            />
        </Item>
      </div>
    );
  }

  renderButton() {
    return (
      <div className="base-button" onClick={this.onClickSubmit}>
        <div className="button">
          Submit
        </div>
      </div>
    );
  }

  renderErrors() {
    const { errors: stateErrors = [] } = this.state;

    const renderMessage = (errors = []) => errors.map((item = {}, index) => {
      const { message } = item;

      return (
        <div className="messasge-part" key={index}>
          { message } 
        </div>
      );
    });

    const items = stateErrors.map((item = {}, index) => {
      const { value, key, errors = [] } = item;

      return (
        <div className="errors-item" key={index}>
          <div className="item-title">{key} - {value}</div>
          <div className="item-message">
            { renderMessage(errors) }
          </div>
        </div>
      );
    });

    return (
      <div className="base-errors">
        { items }
      </div>
    );
  }

  render() {
    const { value = {} } = this.state;
    const { className } = this.props;

    const cls = classnames({
      'pages-home-base-render': true,
      [className]: !!className,
    });

    return (
      <BabyForm
        value={value}
        className={cls}
        ref={this.formRef}
        onChange={this.onChangeForm}>
        { this.renderForm() }
        { this.renderButton() }
        { this.renderErrors() }
      </BabyForm>
    );
  }
}

export default Base;
