export const qs = (selector, ctx) => {
  let context = document;

  if (ctx && ctx.querySelector) {
    context = ctx;
  }

  return context.querySelector(selector);
};

export const ensureElement = ele => {
  ele = typeof ele === 'string' ? qs(ele) : ele;
  if (!ele) throw new Error('ele parameter must be a DOM element or a string');
  return ele;
};

export const qsa = (selector, ctx) => {
  let context = document;

  if (ctx && ctx.querySelector) {
    context = ctx;
  }

  return Array.from(context.querySelectorAll(selector));
};

export const on = (ele, evt, handler, capture) => {
  ele = ensureElement(ele);
  if (!ele || !ele.addEventListener) throw new Error('Not a valid DOM element');
  ele.addEventListener(evt, handler, capture);
};

export const off = (ele, evt, handler, capture) => {
  ele = ensureElement(ele);
  if (!ele || !ele.addEventListener) throw new Error('Not a valid DOM element');
  ele.removeEventListener(evt, handler, capture);
};

export const contains = (container, contained) => container === contained || container?.contains(contained);

export const isVisible = elem => {
  elem = ensureElement(elem);
  return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
};

export const isHidden = elem => !isVisible(elem);
