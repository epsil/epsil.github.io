/**
 * Utility functions for the Document Object Model (DOM),
 * mostly written in jQuery.
 *
 * The following code requires a DOM environment in order to work.
 * If running in the browser, then this is already provided.
 * If running from NodeJS, then one must provide a DOM
 * environment manually, usually by importing jsdom and binding
 * the `document` and `window` variables. See build.js for an example.
 *
 * You may not need a function from this module. Please consider if
 * the desired functionality might be implemented without interacting
 * with the DOM at all. Of course, for certain tasks, DOM code is the
 * most straightforward -- but this approach should be used sparingly.
 */

import $ from 'jquery';
import React from 'react';
import HTMLReactParser from 'html-react-parser';
import { cssPath, pagePath } from './page';
import {
  pipe,
  compose,
  minifyHTML,
  singleRootHTML,
  urlRelative,
  wrapHTML
} from './util';

export function dojQuery(arg, fn, ...opts) {
  // $ -> $
  const dojQueryElement = el => {
    fn(el, ...opts);
    return el;
  };

  // HTML -> HTML
  const doHtmlString = html => {
    const el = $('<div>').html(html);
    dojQueryElement(el);
    return el.html();
  };

  // pseudo-overloading
  if (typeof arg === 'string') {
    return doHtmlString(arg);
  }
  return dojQueryElement(arg);
}

export function wrapjQuery(fn, ...opts) {
  return arg => dojQuery(arg, fn, ...opts);
}

export function wrapjQueryMethod(fn, ...opts) {
  return wrapjQuery(arg => fn.call(arg, ...opts));
}

export function pipejQuery(...fn) {
  return wrapjQuery(pipe(...fn));
}

export function pipejQueryMethods(...fn) {
  return wrapjQuery(pipe(...fn.map(wrapjQueryMethod)));
}

export function composejQuery(...fn) {
  return wrapjQuery(compose(...fn));
}

export function composejQueryMethods(...fn) {
  return wrapjQuery(compose(...fn.map(wrapjQueryMethod)));
}

export function equalsElement(x, y) {
  function html(el) {
    return el
      .prop('outerHTML')
      .replace(/\s+/gi, ' ')
      .replace('> </', '></')
      .trim();
  }
  return html(x) === html(y);
}

// FIXME: this function is incredibly slow
// FIXME: the below implementation cannot be run in parallel
let htmlToTextDiv = null;
export function htmlToText(html) {
  htmlToTextDiv = htmlToTextDiv || $('<div>');
  htmlToTextDiv.html(html);
  const txt = htmlToTextDiv.text().trim();
  htmlToTextDiv.html('');
  return txt;
}

// htmlToText = function (html) {
//   return $('<div>').html(html).text().trim()
// }

export function htmlToJSX(html, options) {
  try {
    const div = singleRootHTML(html);
    const htmlStr = minifyHTML(div);
    return HTMLReactParser(htmlStr, options);
  } catch (err) {
    return htmlToJSXWrapper(html, options);
  }
}

export function htmlToJSXFragment(html, options) {
  if (!html) {
    return undefined;
  }
  const jsx = htmlToJSX(wrapHTML(html, 'div'), options);
  const fragment = React.createElement(
    React.Fragment,
    null,
    jsx.props.children
  );
  return fragment;
}

export function htmlToJSXWrapper(html, options) {
  const htmlStr = html || '';
  return React.createElement('div', {
    dangerouslySetInnerHTML: {
      __html: htmlStr
    }
  });
}

export function isTextNode(node) {
  return node && node.nodeType === 3;
}

export function isCodeName(name) {
  let nodeName = name || '';
  nodeName = nodeName.toUpperCase().trim();
  return (
    nodeName === 'CODE' ||
    nodeName === 'PRE' ||
    nodeName === 'SCRIPT' ||
    nodeName === 'TEXTAREA' ||
    nodeName === 'STYLE'
  );
}

export function isCodeNode(node) {
  let n = node;
  while (n) {
    if (isCodeName(n.nodeName)) {
      return true;
    }
    if (n.parentNode !== n) {
      n = n.parentNode;
    } else {
      n = null;
    }
  }
  return false;
}

export function traverse(fn) {
  return this.each(function() {
    const root = this;
    let node = root.childNodes[0];
    while (node) {
      fn(node);
      if (node.firstChild) {
        node = node.firstChild;
      } else {
        while (!node.nextSibling && node !== root) {
          node = node.parentNode;
        }
        node = node.nextSibling;
      }
    }
  });
}

export function traverseNodes(fn, filter) {
  const filterFn =
    filter ||
    function(node) {
      return true;
    };
  return this.each(function() {
    $(this).traverse(function(node) {
      if (filterFn(node)) {
        fn(node);
      }
    });
  });
}

export function traverseTextNodes(fn, filter) {
  const filterFn =
    filter ||
    function(node) {
      return !isCodeNode(node);
    };
  return this.each(function() {
    $(this).traverseNodes(fn, function(node) {
      return isTextNode(node) && filterFn(node);
    });
  });
}

export function traverseTextNodesHTML(fn, test) {
  return this.each(function() {
    $(this).traverseTextNodes(function(node) {
      if (node) {
        const n = node;
        const txt = n.nodeValue;
        const newTxt = fn(txt);
        if (newTxt !== txt) {
          const span = $('<span>').text(txt);
          const html = span.html();
          const newHtml = fn(html);
          if (newHtml !== html) {
            span.html(newHtml);
            const jNode = $(n);
            // let parent = jNode.parent()
            if (n && jNode) {
              if (n && jNode && span) {
                // n.replaceWith(span)
                jNode.before(span);
                // n.remove()
                n.nodeValue = '';
              }
            }
          }
        }
      }
    });
  });
}

export function removeAria() {
  return this.map(function() {
    return $(this)
      .clone()
      .removeAriaHidden();
  });
}

export function removeAriaHidden() {
  return this.each(function() {
    $(this)
      .find('[aria-hidden="true"]')
      .remove();
  });
}

export function insertCSS(css) {
  $('<style>')
    .prop('type', 'text/css')
    .html('\n' + css.trim() + '\n')
    .appendTo('head');
}

export function insertStylesheet() {
  const css = urlRelative(pagePath(), cssPath);
  const link = $('head').find('link[href="' + css + '"]');
  if (!link.length) {
    $('head').append('<link href="' + css + '" rel="stylesheet">');
  }
}

export function addToHead() {
  const el = $(this);
  if (el.prop('tagName') === 'TITLE') {
    addTitle(el);
  } else if (el.attr('rel') === 'icon') {
    addIcon(el);
  } else {
    addHeadElement(el);
  }
}

export function addTitle(el) {
  const head = $('head');
  const title = head.find('title').first();
  if (title.length > 0) {
    title.text(el.text());
  } else {
    head.prepend(el);
  }
}

// TODO: implement without jQuery
export function removeIcon() {
  $('head')
    .find('link[rel=icon]')
    .remove();
}

export function addIcon(el) {
  removeIcon();
  $('head').append(el);
}

export function addHeadElement(el) {
  const head = $('head');
  const found = head.children().filter(function() {
    return equalsElement($(this), el);
  });
  if (found.length <= 0) {
    head.append(el);
  }
}

// read contents of <iframe>
export function loadIframe(iframe) {
  return new Promise(function(resolve, reject) {
    const file = iframe.attr('src');
    if (!file.match(/\.txt$/)) {
      return loadAjax(iframe);
    }
    iframe.hide();
    iframe.on('load', function() {
      const contents = iframe
        .contents()
        .text()
        .trim();
      const div = $('<div style="display: none">');
      div.text(contents);
      div.insertBefore(iframe);
      iframe.remove();
      const data = div.text().trim();
      resolve(data);
    });
    return null;
  });
}

// read contents of file
export function loadFile(file) {
  return new Promise(function(resolve, reject) {
    $.get({
      url: file,
      success: resolve,
      dataType: 'text',
      cache: false
    }).fail(function() {
      reject(file);
    });
  });
}

export function loadFiles(files) {
  const file = files.shift();
  let promise = loadFile(file);
  files.forEach(function(f) {
    promise = promise.catch(function() {
      return loadFile(f);
    });
  });
  return promise;
}

/* eslint-disable no-unused-vars */
export function loadAjax(iframe) {
  return new Promise(function(resolve, reject) {
    iframe.hide();
    const src = iframe.attr('src');
    const div = $('<div style="display: none">');
    div.insertBefore(iframe);
    iframe.remove();
    loadFile(src).then(function(data) {
      div.text(data);
      resolve(data);
    });
  });
}

if ($ && $.fn) {
  $.fn.traverse = traverse;
  $.fn.traverseNodes = traverseNodes;
  $.fn.traverseTextNodes = traverseTextNodes;
  $.fn.traverseTextNodesHTML = traverseTextNodesHTML;
  $.fn.removeAria = removeAria;
  $.fn.removeAriaHidden = removeAriaHidden;
}

export default {
  dojQuery,
  wrapjQuery,
  wrapjQueryMethod,
  pipejQuery,
  pipejQueryMethods,
  composejQuery,
  composejQueryMethods,
  equalsElement,
  htmlToText,
  htmlToJSX,
  htmlToJSXFragment,
  htmlToJSXWrapper,
  isTextNode,
  isCodeName,
  isCodeNode,
  traverse,
  traverseNodes,
  traverseTextNodes,
  traverseTextNodesHTML,
  removeAria,
  removeAriaHidden,
  insertCSS,
  insertStylesheet,
  addToHead,
  addTitle,
  removeIcon,
  addIcon,
  addHeadElement,
  loadIframe,
  loadFile,
  loadFiles,
  loadAjax
};
