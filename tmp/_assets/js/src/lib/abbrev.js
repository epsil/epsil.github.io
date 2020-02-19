import $ from 'jquery';
// import abbr from '../../../yml/json/abbrev.json';

import { pagePath, abbrPath as abbrevPath } from './page';
import { urlRelative } from './util';

export function abbrPath(base) {
  const basePath = base === undefined ? pagePath() : base || '/';
  return urlRelative(basePath, abbrevPath);
}

export function abbrPathYaml(base) {
  return abbrPath(base)
    .replace(/\.json$/i, '.yml')
    .replace(/\/json/i, '');
}

export function getAbbreviations() {
  // return abbr;
  return {};
}

export function addAcronyms() {
  return this.map(function() {
    return $(this)
      .find('abbr')
      .filter(function() {
        const text = $(this)
          .text()
          .trim();
        return text.toUpperCase() === text;
      })
      .addClass('acronym');
  });
}

export function addSmallCaps() {
  return this.map(function() {
    return $(this)
      .find('sc')
      .replaceWith(function() {
        const span = $('<span class="caps"></span>');
        span.html($(this).html());
        return span;
      });
  });
}

if ($ && $.fn) {
  $.fn.addAcronyms = addAcronyms;
  $.fn.addSmallCaps = addSmallCaps;
}

export default {
  abbrPath,
  getAbbreviations,
  addAcronyms,
  addSmallCaps
};
