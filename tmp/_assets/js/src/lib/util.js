/* global moment:true */
/* exported moment */
import S from 'string';
import URI from 'urijs';
import moment from 'moment';
import CircularJSON from 'circular-json';
import _ from 'lodash';
import { getReference } from './reference';

export function isLocalUrl(str) {
  return (
    URI(str)
      .host()
      .trim() === ''
  );
}

export function isExternalUrl(str) {
  return !isLocalUrl(str);
}

export function urlAnchor(url) {
  return URI(url).hash();
}

export function hasAnchor(url) {
  return (urlAnchor(url) || '').trim() !== '';
}

export function urlWithoutAnchor(url) {
  return URI(url)
    .fragment('')
    .toString();
}

export function urlPlusIndexHtml(url) {
  const hasFilename =
    URI(url)
      .filename()
      .trim() !== '';
  if (hasFilename) {
    return url;
  }
  return urlWithoutAnchor(url) + 'index.html' + urlAnchor(url);
}

export function urlRelativeToBase(base, href) {
  if (base === undefined || href === undefined || base === '' || href === '') {
    return '';
  }

  if (!href.match(/^\//) || (URI(base).is('relative') && !base.match(/^\//))) {
    return href;
  }

  const baseName = URI(base).pathname();
  const uri = new URI(href);
  const relUri = uri.relativeTo(baseName);
  const result = relUri.toString();
  return result === '' ? './' : result;
}

export function urlRelative(base, href, local) {
  let url = urlRelativeToBase(base, href);
  if (local && isLocalUrl(url)) {
    url = urlPlusIndexHtml(url);
  }
  return url;
}

export function urlResolve(base, href) {
  if (base === undefined || href === undefined || base === '' || href === '') {
    return '';
  }

  return URI(href)
    .absoluteTo(base)
    .toString();
}

export function unique(fn) {
  const results = [];
  return function(arg) {
    let result = fn(arg);
    if (results.indexOf(result.valueOf()) >= 0) {
      let i = 1;
      let newresult = '';
      do {
        i++;
        newresult = result + '-' + i;
      } while (results.indexOf(newresult.valueOf()) >= 0);
      result = newresult;
    }
    results.push(result.valueOf());
    return result;
  };
}

export const pipe = _.flow;

export const compose = _.flowRight;

export function slugify(str) {
  // should this function retain `_` for GitHub compatibility?
  return S(str.replace(/\//g, '-').trim()).slugify();
}

export function getCachedUrl(url, refs) {
  const ref = getCachedUrlRef(url, refs);
  return (ref && ref.href) || url;
}

// TODO: define equivalence relation for URLs
// and call getReferenceByPredicate()
export function getCachedUrlRef(url, refs) {
  let urlStr = url;
  let ref = getReference(urlStr, refs);
  if (!ref) {
    const newUrl = urlWithoutAnchor(urlStr);
    if (newUrl !== urlStr) {
      urlStr = newUrl;
      ref = getReference(urlStr, refs);
    }
  }
  if (!ref) {
    if (urlStr.match(/^http:/i)) {
      ref = getReference(urlStr.replace(/^http/i, 'https'), refs);
    } else if (urlStr.match(/^https:/i)) {
      ref = getReference(urlStr.replace(/^https/i, 'http'), refs);
    }
  }
  if (!ref) {
    if (urlStr.match(/:\/\/www\./i)) {
      ref = getReference(urlStr.replace(/:\/\/www\./i, '://'), refs);
    } else {
      ref = getReference(urlStr.replace(/:\/\//i, '://www.'), refs);
    }
  }
  return ref;
}

export function dateFormat(context, block) {
  if (moment) {
    const date = moment(context)
      .format('YYYY-MM-DD')
      .trim();
    if (date === 'Invalid date' || date === '1970-01-01') {
      return context;
    }
    return date;
  }
  return context;
}

export function hasRoot(html) {
  return html.trim().match(/^</); // this is broken
}

export function minifyHTML(html, options) {
  // https://jaketrent.com/post/remove-whitespace-html-javascript/
  return withSkippedPreTags(html, str => str.replace(/>\n+</g, '><'));
}

export function singleRootHTML(html, root) {
  const htmlStr = html || '';
  if (!hasRoot(htmlStr)) {
    return wrapHTML(htmlStr, root);
  }
  return htmlStr;
}

export function wrapHTML(html, root) {
  const htmlStr = html || '';
  const rootEl = root || 'div';
  return '<' + rootEl + '>' + htmlStr + '</' + rootEl + '>';
}

export function replaceInHTML(html, fn) {
  const reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;
  //                  (  $1   ) ( $2  )(   $3    )
  const reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;
  if (!html && typeof html !== 'string') {
    return html;
  }
  return html.replace(reIntraTag, function(str, prefix, htmlStr, suffix) {
    const prefixStr = prefix || '';
    const suffixStr = suffix || '';
    if (prefixStr.match(reSkipTags)) {
      return prefixStr + htmlStr + suffixStr;
    }
    return prefixStr + fn(htmlStr) + suffixStr;
  });
}

function withSkippedRegions(str, regexp, fn) {
  const matchRegion = function(s, re) {
    const match = s.match(re);
    if (match) {
      return [
        { str: s.substring(0, match.index), readOnly: false },
        { str: match[0], readOnly: true }, // skipped region
        { str: s.substring(match.index + match[0].length), readOnly: false }
      ];
    }
    return [{ str: s, readOnly: false }];
  };

  const calculateRegions = function(s, re) {
    let regions = [];
    let rest = s;
    let result;
    let match;
    do {
      result = matchRegion(rest, re);
      match = result.length > 1;
      regions = regions.concat(result);
      if (match) {
        rest = regions.pop().str; // skipped region
      } else {
        break;
      }
    } while (rest !== '');
    return regions;
  };

  const regions = calculateRegions(str, regexp);

  return regions
    .map(region => {
      if (region.readOnly || region.str === '') {
        return region.str; // skipped region
      }
      return fn(region.str);
    })
    .join('');
}

export function withSkippedPreTags(html, fn) {
  const pre = /<pre[\s]*[^>]*>[\s\S]*?<\/pre>/i;
  return withSkippedRegions(html, pre, fn);
}

// export function withSkipTags(html, fn) {
//   // TODO: better implementation -- splitting input string into
//   // substrings, performing substitution only on non-pre substrings,
//   // and finally concatenating all substrings together
//   const pre = /<pre[\s]*[^>]*>[\s\S]*?<\/pre>/gi;
//   const matches = html.match(pre);
//   const result = fn(html);
//   let i = 0;
//   return result.replace(pre, () => matches[i++]);
// }

export function markupPunctuation(html) {
  return replaceInHTML(html, function(htmlStr) {
    return (
      htmlStr
        .replace(/:/g, '<span class="colon">:</span>')
        // .replace(/;/g, '<span class="semicolon">;</span>')
        .replace(/\?/g, '<span class="questionmark">?</span>')
        .replace(/!/g, '<span class="exclamationmark">!</span>')
        .replace(/\(/g, '<span class="openparen">(</span>')
        .replace(/\)/g, '<span class="closeparen">)</span>')
        .replace(/\[/g, '<span class="openbracket">[</span>')
        .replace(/]/g, '<span class="closebracket">]</span>')
        .replace(/\u2014/g, '<span class="emdash">&mdash;</span>')
    );
  });
}

/**
 * Serialize an object to a JSON string, robustly.
 * This function also handles circular references, if need be.
 * @param value The value to serialize
 * @param replacer A replacer function, as passed to `JSON.stringify()`
 * @param space The number of spaces for indentation, as passed to `JSON.stringify()`
 * @param ascii Whether to output plain ASCII
 *              (escapes Unicode characters with `\uXXXX` syntax)
 */
export function JSONStringify(value, replacer, space, ascii) {
  let json = '';
  try {
    json = JSON.stringify(value, replacer, space);
  } catch (err) {
    json = CircularJSON.stringify(value, replacer, space);
  }
  if (ascii) {
    // https://stackoverflow.com/questions/4901133/json-and-escaping-characters#answer-4901205
    json = json.replace(/[\u007f-\uffff]/gi, function(c) {
      return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  return json;
}

export function prettyJSON(value, replacer, space, ascii) {
  const indent = space === undefined ? 2 : space;
  return JSONStringify(value, replacer, indent, ascii);
}

/**
 * Wraps ampersands in HTML with ``<span class="amp">`` so they can be
 * styled with CSS. Ampersands are also normalized to ``&amp;``. Requires
 * ampersands to have whitespace or an ``&nbsp;`` on both sides.
 *
 */
export function amp(text) {
  const reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;
  //             (    $1   )(     $       )(   $3    )
  const reAmp = /(\s|&nbsp;)(&|&amp;|&#38;)(\s|&nbsp;)/g;
  //                  ( prefix) ( txt )(  suffix )
  const reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;
  if (!text && typeof text !== 'string') {
    return '';
  }
  return text.replace(reIntraTag, function(str, prefix, txt, suffix) {
    const prefixStr = prefix || '';
    const suffixStr = suffix || '';
    let txtStr = txt;
    if (prefixStr.match(reSkipTags)) {
      return prefixStr + txt + suffixStr;
    }
    txtStr = txtStr.replace(reAmp, '$1<span class="amp">&amp;</span>$3');
    return prefixStr + txtStr + suffixStr;
  });
}

/**
 * Replace Unicode punctuation with their ASCII equivalents.
 *
 * Simplifies "smart quotes", typographical dashes and other
 * characters that might confuse search engines.
 *
 * @param {string} str - A string.
 * @return {string} - A new string.
 */
export function replacePunctuation(str) {
  return str
    .replace(/[\u2018\u2019\u00b4]/gi, "'")
    .replace(/[\u201c\u201d\u2033]/gi, '"')
    .replace(/[\u2212\u2022\u00b7\u25aa]/gi, '-')
    .replace(/[\u2013\u2015]/gi, '-')
    .replace(/\u2014/gi, '-')
    .replace(/\u2026/gi, '...');
}

/**
 * Intelligently convert a string to pure ASCII.
 *
 * Replace Unicode characters with their ASCII equivalents as much
 * as possible. Then strip away all remaining Unicode characters.
 *
 * @param {string} str - A string.
 * @return {string} - A new string.
 */
export function toAscii(str) {
  let result = replacePunctuation(str);
  result = _.deburr(result);
  result = result.replace(/[^-\w\s().,:;?!'"#%=&/]/gi, '');
  return result.trim();
}

export default {
  isLocalUrl,
  isExternalUrl,
  urlAnchor,
  hasAnchor,
  urlWithoutAnchor,
  urlPlusIndexHtml,
  urlRelativeToBase,
  urlRelative,
  urlResolve,
  unique,
  pipe,
  compose,
  slugify,
  getCachedUrl,
  getCachedUrlRef,
  dateFormat,
  hasRoot,
  minifyHTML,
  singleRootHTML,
  wrapHTML,
  replaceInHTML,
  withSkippedRegions,
  withSkippedPreTags,
  markupPunctuation,
  JSONStringify,
  prettyJSON,
  amp
};
