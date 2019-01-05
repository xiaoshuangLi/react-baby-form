export function timeout(cb, time) {
  if (!cb) {
    return;
  }
  time = time || 0;

  const timeId = setTimeout(() => {
    cb();
    clearTimeout(timeId);
  }, time);
}

export function load(src = '', cb) {
  if (!src) {
    return cb && cb();
  }
  const img = new Image();
  img.src = src;

  img.onload = () => {
    cb && cb(img);
  };

  img.onerror = () => {
    cb && cb(img);
  };
}

export function loadAll(list = [], cb) {
  typeof list === 'string' && (list = [list]);

  if (!list.length) {
    return cb && cb();
  }

  let num = 0;
  const len = list.length;
  const imgs = [];

  list.forEach(img => load(img, (ele) => {
    num += 1;

    for (let v = 0; v < len; v += 1) {
      const val = list[v];
      const { src } = ele;
      const index = src.indexOf(val);

      if (!!~index) {
        imgs[index] = ele;
        break;
      }
    }

    if (num >= len) {
      return cb && timeout(() => {
        cb(imgs);
      });
    }
  }));
}

export function isUndefined(val, dVal = '') {
  return val === undefined ? dVal : val;
}

function valid(el) {
  if (!el) {
    return true;
  }

  if (el.checkValidity) {
    return el.checkValidity();
  }

  return true;
}

export function getEle(selector = window) {
  selector = typeof selector === 'string' ? document.querySelector(selector) : selector;

  return selector;
}

export function getEles(selector) {
  if (!selector) {
    return [document];
  }

  return document.querySelectorAll(selector);
}

export function validInput(ele) {
  if (!ele) {
    return true;
  }

  if (ele.checkValidity) {
    return ele.checkValidity();
  }

  const eles = ele.querySelectorAll('*');

  for (let v = 0, l = eles.length; v <= l; v += 1) {
    if (!valid(eles[v])) {
      return false;
    }
  }

  return true;
}

export function getStyle(ele = '') {
  ele = getEle(ele);

  if (!ele) {
    return {};
  }

  const { ownerDocument = {} } = ele;

  let view = ownerDocument.defaultView;

  if (!view || !view.opener) {
    view = window;
  }

  const res = view.getComputedStyle(ele);

  return res || {};
}

export function getStyleValue(ele = '', attr = '') {
  if (!ele || !attr) {
    return '';
  }

  const style = getStyle(ele);

  return style.getPropertyValue[attr];
}

export function createDom(className = 'dom-comp-container', tag = 'div') {
  if (typeof document === 'undefined') {
    return;
  }

  const dom = document.createElement(tag);
  dom.classList.add(className);
  document.body.appendChild(dom);

  return dom;
}

export function getValueFromEvent(event) {
  if (!event) {
    return event;
  }

  const target = event.target === undefined ? event : event.target;
  const value = target.value === undefined ? target : target.value;

  return value;
}

let baseId = new Date().getTime();

export function getUId() {
  baseId += 1;
  return baseId;
}

export const renderBy = status => node => !!status ? node : null;
