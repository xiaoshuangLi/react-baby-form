import JSONbig from 'json-bigint';

import fetchAPI, { setServices } from 'za-fetch-api';

const JSONbigParse = JSONbig({ storeAsString: true }).parse;

fetchAPI.setParseResponse(res => res.text().then(JSONbigParse));

setServices({
  bpmPlus: {
    host: 'https://t-api.zuifuli.com/api/bpmPlus',
  },
});

export default fetchAPI;
