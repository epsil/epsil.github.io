import $ from 'jquery';
import _ from 'lodash';
import URI from 'urijs';
import { compareTwoStrings } from 'string-similarity';
import { mdInline } from './markdown';
import { pagePath, refsPath as referencesPath } from './page';
import { ascending, descending, sort } from './sort';
import { urlRelative } from './util';
// import references from '../../../json/references.json';

export function refsPath(base) {
  const basePath = base === undefined ? pagePath() : base || '/';
  return urlRelative(basePath, referencesPath);
}

export function sitemapPath(base) {
  const basePath = base === undefined ? pagePath() : base || '/';
  const siteMap = '/sitemap.yml';
  return urlRelative(basePath, siteMap);
}

export function refsPathYaml(base) {
  return refsPath(base)
    .replace(/\.json$/i, '.yml')
    .replace(/\/json/i, '');
}

export function Reference(label, href, title, hidden, props) {
  this.label = label;
  this.href = href;
  this.title = title;
  if (hidden) {
    this.hidden = hidden;
  }
  if (props) {
    Object.keys(props).forEach(prop => {
      this[prop] = props[prop];
    });
  }
}

export function addReferenceToDictionary(ref, dict, force) {
  const newDict = dict;
  const label = normalizeLabel(ref.label);
  if (!newDict[label] || force) {
    const newRef = makeUnlabeledReference(ref);
    newDict[label] = newRef;
  }
  return newDict;
}

export function arrayToDictionary(arr) {
  const dict = {};
  arr.forEach(function(ref) {
    addReferenceToDictionary(ref, dict);
  });
  return dict;
}

export function extractReferencesFromMarkdown(md, refs) {
  return mergeDictionaries(
    extractReferenceDefinitionsFromMarkdown(md),
    extractReferenceAnchorsFromMarkdown(md, refs)
  );
}

export function removeUnsafeReferences(refs) {
  const safeRefs = refs;
  // '[x]' confuses markdown-it-task-checkbox
  delete safeRefs.X;
  // '[...]' is reserved for collapse.js
  delete safeRefs['...'];
  delete safeRefs['\u2026'];
  return safeRefs;
}

export function extractReferenceDefinitionsFromMarkdown(md) {
  let newDict = {};
  const lines = md.trim().split(/\r?\n/);
  lines.forEach(function(line) {
    const match = line.match(/^\[([^\]]+)]: (.*?)( "(.*)")?$/i);
    const isFootnote = match && match[1].match(/^\^/);
    if (match && !isFootnote) {
      const ref = new Reference(match[1], match[2], match[4]);
      newDict = addReferenceToDictionary(ref, newDict);
    }
  });
  return newDict;
}

export function extractReferenceAnchorsFromMarkdown(md, refs) {
  let newDict = {};
  const mdStr = md.trim();
  const regexp = /\[(([^#\]]+)(#[^#\]]+))]/gi;
  let matches;
  while ((matches = regexp.exec(mdStr)) !== null) {
    const label = matches[1];
    const title = matches[2];
    const anchor = matches[3];
    let ref = getReference(title, refs);
    if (ref) {
      const href =
        URI(ref.href)
          .fragment('')
          .toString() + anchor;
      ref = new Reference(label, href, ref.title);
      newDict = addReferenceToDictionary(ref, newDict);
    }
  }
  return newDict;
}

export function forEach(dict, fn) {
  const refs = dict || {};
  Object.keys(refs).forEach(function(label) {
    fn(makeLabeledReference(label, refs[label]));
  });
}

export function getReference(obj, dict) {
  const refs = dict || getReferences();
  if (typeof obj === 'string') {
    return getReferenceByLabel(obj, refs);
  }
  return getReferenceByPredicate(obj, refs);
}

export function getReferenceByHref(href, dict) {
  const refs = dict || getReferences();
  return getReferenceByPredicate(function(ref) {
    return ref.href === href;
  }, refs);
}

export function getReferenceByLabel(label, dict) {
  const refs = dict || getReferences();
  const normLabel = normalizeLabel(label);
  if (!refs[normLabel]) {
    return null;
  }
  return makeLabeledReference(normLabel, refs[normLabel]);
}

export function getReferenceByPredicate(pred, dict) {
  const refs = dict || getReferences();
  const labels = Object.keys(refs);
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const ref = makeLabeledReference(label, refs[label]);
    if (pred(ref)) {
      return ref;
    }
  }
  return null;
}

export function getReferencesByPredicate(pred, dict) {
  const refs = dict || getReferences();
  const arr = [];
  Object.keys(refs).forEach(function(label) {
    const ref = makeLabeledReference(label, refs[label]);
    if (pred(ref)) {
      arr.push(ref);
    }
  });
  return arr;
}

export function getReferences() {
  // return references;
  return {};
}

export function mergeDictionaries(...dicts) {
  return _.assign({}, ...dicts);
}

export function dictionaryToArray(dict) {
  const refs = dict || getReferences();
  const arr = [];
  forEach(refs, function(ref) {
    arr.push(ref);
  });
  return arr;
}

export function makeReference(label, href, title) {
  return new Reference(label, href, title);
}

export function makeLabeledReference(label, ref) {
  const labeledRef = Object.assign({}, ref);
  labeledRef.label = label;
  return labeledRef;
}

export function makeUnlabeledReference(ref) {
  const unlabeledRef = Object.assign({}, ref);
  delete unlabeledRef.label;
  return unlabeledRef;
}

export function normalizeLabel(label) {
  return label
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

export function sortDictionary(dict) {
  let arr = dictionaryToArray(dict);
  arr = arr.sort(function(ref1, ref2) {
    if (ref1.label < ref2.label) {
      return -1;
    }
    return ref1.label > ref2.label ? 1 : 0;
  });
  return arrayToDictionary(arr);
}

export function search(str, dict) {
  const searchStr = str.toUpperCase();
  if (searchStr === '') {
    return [];
  }
  let arr = dictionaryToArray(dict);
  const isExplicit = searchStr.match(/!/);
  if (!isExplicit) {
    arr = arr.filter(function(x) {
      return x.hidden !== true;
    });
  }
  arr = sort(
    arr,
    descending(function(x) {
      const label = x.label.toUpperCase();
      return compareTwoStrings(label, searchStr);
    })
  );
  arr = _.uniqBy(arr, function(x) {
    // return x.href
    return URI(x.href)
      .fragment('')
      .toString();
  });
  arr = _.take(arr, 5);
  // arr = sort(arr, descending(function (x) {
  //   let title = x.title || x.label
  //   title = title.toUpperCase()
  //   return compareTwoStrings(title, searchStr)
  // }))
  return arr;
}

export function searchHandler(refs) {
  return function(e) {
    const form = $(this);
    const input = form.find('input');
    let str = input.val();
    str = str.replace(/\s+/gi, ' ').trim();
    const matches = search(str, refs);
    updateSearchMatches(matches);
    return false;
  };
}

export function renderSearchMatches(matches) {
  if (matches.length === 0) {
    return '';
  }
  let counter = 1;
  return (
    '<ol>' +
    matches
      .map(function(match) {
        // if only we had some template syntax like JSX
        // to make this simpler
        const li = $('<li>');
        const a = $('<a>');
        a.attr('accesskey', counter++);
        a.attr('href', match.href);
        a.attr('title', match.href);
        if (match.title) {
          // a.text(mdToText(match.title));
          a.html(mdInline(match.title, { linkify: false }));
        } else {
          a.text(_.capitalize(match.label));
        }
        li.append(a);
        return li.prop('outerHTML');
      })
      .join('') +
    '</ol>'
  );
}

export function updateSearchMatches(matches) {
  const html = renderSearchMatches(matches);
  const div = findSearchMatchesContainer();
  div.html(html);
  div.relativizeUrls(pagePath());
  div.find('a').focus(function() {
    setTimeout(function() {
      hideSearchMatches();
    }, 500);
  });
  div.fixLinks();
}

export function hideSearchMatches() {
  updateSearchMatches([]);
  $('nav form input').val('');
}

export function findSearchMatchesContainer() {
  let div = $('nav .search').first();
  if (div.length === 0) {
    div = $('<div class="search container-fluid"></div>');
    const container = $('nav .container-fluid').first();
    container.after(div);
  }
  return div;
}

// breadcrumbs = function (pathStr) {
//   let newPathSegments = []
//   let breadcrumbPaths = []
//   pathStr = pathStr.replace(/^\//, '')
//              .replace(/\/$/, '')
//   let pathSegments = pathStr.split('/')
//   pathSegments.pop()
//   while (pathSegments) { // eslint-disable-line
//     let newSegment = pathSegments.shift()
//     newPathSegments.push(newSegment)
//     let breadcrumbPath = '/' + newSegment.join('/') + '/'
//     breadcrumbPaths.push(breadcrumbPath)
//   }
//   return breadcrumbPaths
// }

// breadcrumbs2 = function (pathStr) {
//   let breadcrumbPaths = []
//   let matches = []
//   let regexp = /^(.*\/)([/]*\/)$/
//   while ((matches = pathStr.match(regexp))) {
//     pathStr = matches[1]
//     breadcrumbPaths.unshift(pathStr)
//   }
//   return breadcrumbPaths
// }

// better approach: get all references first,
// THEN render
//
// alternate approach: getReferencesByHref(... regexp ...)

export function breadcrumbRefs(pathStr) {
  let refs = getReferencesByPredicate(function(ref) {
    return pathStr !== ref.href && pathStr.startsWith(ref.href);
  });
  refs = sort(
    refs,
    ascending(function(ref) {
      return ref.href;
    })
  );
  return refs;
}

export function subPageRefs(pathStr) {
  let refs = getReferencesByPredicate(function(ref) {
    return pathStr !== ref.href && ref.href.startsWith(pathStr);
  });
  refs = sort(
    refs,
    ascending(function(ref) {
      return ref.href;
    })
  );
  return refs;
}

// move this into the page template as a Handlebars helper?
export function renderBreadcrumbs(pathStr) {
  return renderLinkList(breadcrumbRefs(pathStr));
}

export function renderSubPages(pathStr) {
  return renderLinkList(subPageRefs(pathStr));
}

export function renderLinkList(refs, ordered) {
  const lis = refs
    .map(function(ref) {
      const li = $('<li>');
      const a = $('<a>');
      a.attr('href', ref.href);
      a.text(ref.title);
      li.append(a);
      return li.prop('outerHTML');
    })
    .join('');
  return ordered ? '<ol>' + lis + '</ol>' : '<ul>' + lis + '</ul>';
}

export default {
  refsPath,
  sitemapPath,
  Reference,
  addReferenceToDictionary,
  arrayToDictionary,
  extractReferencesFromMarkdown,
  removeUnsafeReferences,
  extractReferenceDefinitionsFromMarkdown,
  extractReferenceAnchorsFromMarkdown,
  forEach,
  getReference,
  getReferenceByHref,
  getReferenceByLabel,
  getReferenceByPredicate,
  getReferencesByPredicate,
  getReferences,
  mergeDictionaries,
  dictionaryToArray,
  makeReference,
  makeLabeledReference,
  makeUnlabeledReference,
  normalizeLabel,
  sortDictionary,
  search,
  searchHandler,
  renderSearchMatches,
  updateSearchMatches,
  hideSearchMatches,
  findSearchMatchesContainer,
  breadcrumbRefs,
  subPageRefs,
  renderBreadcrumbs,
  renderSubPages,
  renderLinkList
};
