const runBy = (cb) => (value, condition) => {
  if (condition === undefined) {
    return true;
  }

  return cb && cb(value, condition);
};

const useless = ['', undefined, null];

const runMaxLength = runBy((value = '', maxLength) => value.length <= maxLength);
const runMinLength = runBy((value = '', minLength) => value.length >= minLength);
const runMax = runBy((value, max) => value <= max);
const runMin = runBy((value, min) => value >= min);
const runPattern = runBy((value = '', pattern) => pattern && new RegExp(pattern).test(value));
const runFn = runBy((value = '', fn) => fn && fn(value));
const runRequired = runBy((value, required) => {
  const bool = !!required;
  const useful = !useless.includes(value);

  return bool ? useful : true;
});

const runObj = {
  maxLength: runMaxLength,
  minLength: runMinLength,
  max: runMax,
  min: runMin,
  required: runRequired,
  pattern: runPattern,
  fn: runFn,
};

const _continued = (value, opts) => {
  const { required, _required } = opts;
  const included = useless.includes(value);

  if (required || _required) {
    return true;
  }

  if (!included) {
    return true;
  }

  return false;
};

const check = (value, opts = {}) => {
  const keys = Object.keys(runObj);
  const errors = [];

  if (!_continued(value, opts)) {
    return errors;
  }

  keys.forEach((key) => {
    const _key = `_${key}`;

    const run = runObj[key];
    const condition = opts[key] || opts[_key];

    const status = run(value, condition);

    !status && errors.push({
      key,
      condition,
    });
  });

  return errors;
};

export default check;
