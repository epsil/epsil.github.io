import $ from 'jquery';
import URI from 'urijs';
import { urlRelative } from './util';
import settings from '../../../yml/json/settings.json';

export const jsPath = settings.jsPath;
export const cssPath = settings.cssPath;
export const refsPath = settings.refsPath;
export const abbrPath = settings.abbrPath;
export const mdPath = settings.mdPath;
export const pgpPath = settings.pgpPath;

export function root() {
  let href = window.location.href;
  // FIXME: use file part of jsPath
  const script = $('script[src*="wiki"]');
  let src = script.attr('src');
  // FIXME: use URI.js instead of regexps
  href = href.replace(/[^/]*.html?$/i, '');
  src = src.replace(jsPath.replace(/^\//, ''), '');
  src = URI(src)
    .absoluteTo(href)
    .toString();
  return src;
}

// address of current page
export function pagePath() {
  const base = root();
  let href = window.location.href;
  // FIXME: use URI.js instead of regexps
  href = href.replace(/#[^#]*$/, '');
  href = href.replace(/[^/]*.html?$/i, '');
  return '/' + href.replace(base, '');
}

// !-separated arguments in the hash (#) part of the URL
export function hashArgs(idx) {
  let args = [];
  const href = window.location.href;
  const hash = URI(href).hash();
  if (hash) {
    args = hash.split('!');
  }
  return Number.isInteger(idx) ? args[idx] : args;
}

export function hashArgsCount() {
  return hashArgs().length;
}

export function isLocalFile() {
  return URI(window.location.href).protocol() === 'file';
}

export default {
  jsPath,
  cssPath,
  refsPath,
  abbrPath,
  mdPath,
  pgpPath,
  root,
  pagePath,
  hashArgs,
  hashArgsCount,
  isLocalFile
};
