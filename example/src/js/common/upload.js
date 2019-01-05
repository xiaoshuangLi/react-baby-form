import fetchAPI from './fetch';

const UPLOADING_CODE = 'uploading';

const fileStore = {};
const callbackStore = {};

const addCallback = (key, callback) => {
  const baseList = callbackStore[key] || [];
  const list = baseList.concat(callback);

  callbackStore[key] = list;
};

const removeCallback = (key, url) => {
  const list = callbackStore[key] || [];

  fileStore[key] = url;
  callbackStore[key] = [];

  list.forEach(callback => callback({
    code: 0,
    result: url,
  }));
};

const upload = (baseFile = {}) => {
  const { originFileObj } = baseFile;
  const file = originFileObj || baseFile;
  const { name = '', size = 0 } = file;

  const key = `${name}-${size}`;
  const storeUrl = fileStore[key];

  if (storeUrl) {
    return Promise.resolve({
      code: 0,
      result: storeUrl,
    });
  }

  if (storeUrl === UPLOADING_CODE) {
    return new Promise(resolve => addCallback(key, resolve));
  }

  const data = new FormData();

  data.append('file', file);
  fileStore[key] = UPLOADING_CODE;

  return new Promise((resolve) => {
    addCallback(key, resolve);

    fetchAPI.form({
      server: 'bpmPlus',
      path: '/v5/attachment/upload/ret/url',
      loading: true,
      data,
    }).then((res = {}) => {
      const { code, result = {} } = res;
      const { url } = result;

      if (Number(code)) {
        return {};
      }

      removeCallback(key, url);
    });
  });
};

export default upload;
