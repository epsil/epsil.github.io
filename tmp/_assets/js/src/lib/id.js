import $ from 'jquery';
import _ from 'lodash';
import { slugify, unique } from './util';

export function addIdAttributeToAllElements(prefix) {
  const prefixStr = prefix || '';
  const dict = {};

  const getCount = name => dict[name] || 0;

  const setCount = (name, count) => {
    dict[name] = count;
  };

  const incCount = name => {
    setCount(name, getCount(name) + 1);
  };

  const makeId = (name, pre) => {
    let id = name + '-' + getCount(name);
    if (pre) {
      id = pre + '-' + id;
    }
    return id;
  };

  const makeUniqueId = (name, pre) => {
    incCount(name);
    return makeId(name, prefixStr);
  };

  const removeClass = (el, c) => {
    el.removeClass(c);
    const hasEmptyAttribute = (el.attr('class') || '').trim() === '';
    if (hasEmptyAttribute) {
      el.removeAttr('class');
    }
  };

  const addId = el => {
    const name = el.prop('tagName').toLowerCase();
    const id = makeUniqueId(name, prefixStr);
    const currentId = el.attr('id');
    if (currentId) {
      if (id !== currentId) {
        el.addClass(id);
      }
    } else {
      el.attr('id', id);
      removeClass(el, id);
    }
  };

  return this.map(function() {
    const body = $(this);
    const children = body.find('*');
    children.each(function() {
      addId($(this));
    });
    return body;
  });
}

export function generateId(el, prefix) {
  let id = (prefix || '') + slugify(el.text());
  id = _.truncate(id, { length: 50, omission: '' });
  if (!id.match(/^[a-z]/i)) {
    id = 'n' + id;
  }
  return id;
}

export function getId(el) {
  let id = el.attr('id');
  if (id) {
    if (!id.match(/^[a-z]/i)) {
      id = 'n' + id;
      el.attr('id', id);
    }
    return id;
  }
  id = generateUniqueId(el);
  el.attr('id', id);
  return id;
}

export const generateUniqueId = unique(generateId);

if ($ && $.fn) {
  $.fn.addIdAttributeToAllElements = addIdAttributeToAllElements;
}

export default {
  addIdAttributeToAllElements,
  generateId,
  getId,
  generateUniqueId
};
