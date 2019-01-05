const getTitleFromOpts = (opts = {}) => {
  const {
    _name,
    _title,
    name,
    title,
  } = opts;

  const nameText = _name || name;
  const titleText = _title || title;

  return titleText || nameText;
};

const defaultWarning = {
  maxLength(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} too long`;
  },
  minLength(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} too short`;
  },
  max(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} too big`;
  },
  min(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} too small`;
  },
  required(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} is required`;
  },
  pattern(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} is not in right format`;
  },
  fn(value, condition, opts) {
    const text = getTitleFromOpts(opts);

    return `${text} doesn't work.`;
  },
};

const warn = (baseWarning = {}) => {
  const warning = Object.assign({}, defaultWarning, baseWarning);

  return (value, error = {}, opts = {}) => {
    const { key, condition } = error;
    const fn = warning[key];

    if (!condition) {
      return;
    }

    return fn && fn(value, condition, opts);
  };
};

export default warn;
