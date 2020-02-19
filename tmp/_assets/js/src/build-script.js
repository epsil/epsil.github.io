/* global document:true, window:true */
import fg from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import * as Rx from 'rxjs/Rx';
import * as RxOp from 'rxjs/operators';
import yaml from 'js-yaml';
import _ from 'lodash';
import { tidy_html5 as tidy } from 'tidy-html5';
import { markdown, mdToText, mdToAscii } from './lib/markdown';
import {
  refsPath,
  refsPathYaml,
  sitemapPath,
  arrayToDictionary,
  getReference,
  normalizeLabel,
  Reference,
  sortDictionary
} from './lib/reference';
import {
  JSONStringify,
  isExternalUrl,
  urlRelative,
  urlResolve
} from './lib/util';
import settings from '../../yml/json/settings.json';

const root = '/';
const basePath = root; // script is expected to be executed from here
const referencesPath = refsPath(basePath);
const referencesPathYaml = refsPathYaml(basePath);
const sitemapPathYaml = sitemapPath(basePath);

// simple filename -> URL mapping
function location(file) {
  let addr = file.substr(0, file.length - path.basename(file).length);
  addr = addr.replace(/\\/g, '/');
  addr = '/' + addr;
  return addr.trim();
}

function url(file) {
  let addr = location(file);
  addr = addr.replace(/^\//g, '');
  addr = settings.url + addr;
  return addr;
}

function htmlfile(textfile) {
  const file = textfile.replace(/\.asc$/i, '');
  return file.substr(0, file.length - path.extname(file).length) + '.html';
}

function format(html) {
  // if (!tidy) {
  //   return html;
  // }
  let newHtml = tidy(html, {
    'drop-empty-elements': false,
    indent: false,
    'indent-attributes': false,
    'input-encoding': 'utf8',
    'numeric-entities': true,
    'new-inline-tags':
      'math ' +
      'annotation ' +
      'merror ' +
      'mfrac ' +
      'mi ' +
      'mn ' +
      'mo ' +
      'mover ' +
      'mphantom ' +
      'mrow ' +
      'mspace ' +
      'msqrt ' +
      'mstyle ' +
      'msub ' +
      'msubsup ' +
      'msup ' +
      'mtable ' +
      'mtd ' +
      'mtext ' +
      'mtr ' +
      'munder ' +
      'semantics',
    'output-encoding': 'ascii',
    quiet: true,
    'show-info': false,
    'show-warnings': false,
    'sort-attributes': 'alpha',
    'tidy-mark': false,
    'vertical-space': true,
    wrap: 0
  });

  // Since UTF-8 is a superset of raw ASCII, we can substitute 'utf-8'
  // for 'us-ascii' as the declared character encoding (a useful
  // safeguard if any non-ASCII characters should somehow make their
  // way into the page). In general, though, we try to keep things as
  // plain as possible by returning raw ASCII in the range 0-127 and
  // using numeric character references for the rest.
  newHtml = newHtml
    .replace(/\n<\/code>\n<\/pre>/g, '</code>\n</pre>')
    .replace(
      '<meta content="text/html; charset=us-ascii" http-equiv="Content-Type">',
      '<meta content="text/html; charset=utf-8" http-equiv="Content-Type">'
    );

  return newHtml;
}

function template(view) {
  return `<!DOCTYPE html>
<html>
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
${
  view.referrer
    ? `<meta content="${view.referrer}" name="referrer">`
    : '<meta content="no-referrer" name="referrer">'
}
${view.noindex ? '<meta content="noindex" name="robots">' : ''}
<meta content="text/css" http-equiv="Content-Style-Type">
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="${urlRelative(
    view.path,
    '/favicon.ico'
  )}" rel="icon" type="image/x-icon">
<link href="${urlRelative(
    view.path,
    '/_assets/css/wiki.css'
  )}" rel="stylesheet">
<script src="${urlRelative(view.path, '/_assets/js/wiki.js')}"></script>
</head>
<body>
</body>
</html>`;
}

function convert(input, output) {
  return new Promise(function(resolve, reject) {
    fs.readFile(input, function(readErr, data) {
      if (readErr) {
        reject(readErr);
      } else {
        // if (settings.compile) {
        //   data = data ? data.toString() : '';
        // } else {
        //   data = '';
        // }
        const view = _.assign({}, settings, {
          content: '',
          path: location(input)
        });
        let html = template(view);
        if (settings.tidy) {
          html = format(html);
        }
        fs.writeFile(output, html, function(writeErr) {
          if (writeErr) {
            reject(writeErr);
          } else {
            console.log('Converted ' + input + ' to ' + output);
            resolve(input);
          }
        });
      }
    });
  });
}

function metadata(file) {
  // console.log('Reading metadata of ' + file)
  let str =
    fs
      .readFileSync(file)
      .toString()
      .trim() + '\n';
  const isYaml = file.match(/.ya?ml$/gi);
  const isIndex = file.match(/.?index(\.md|\.yml)$/i);
  if (isYaml && !str.match(/^---/)) {
    str = '---\n' + str + '\n---';
  }
  if (!str.match(/^---/) && str.match(/^([\s\S]*)[\r\n]+---/)) {
    str = '---\n' + str;
  }
  let view = {};
  try {
    view = matter(str);
  } catch (err) {
    return {};
  }
  if (typeof view.data === 'string') {
    return {};
  }
  const data = view.data;
  data.title = data.title || '';
  if (data.path) {
    // do nothing
  } else if (isYaml && !isIndex && !data.file && data.url) {
    data.path = data.url;
  } else if (data.file) {
    data.path = location(file) + encodeURIComponent(data.file);
  } else if (isIndex) {
    // FIXME: use settings.index
    data.path = location(file);
  } else {
    data.path = '/' + file.replace(/\.yml$/i, '');
  }
  return data;
}

function convertFile(file) {
  return convert(file, htmlfile(file));
}

function makeReferences(files) {
  const meta = files.map(metadata).filter(function(entry) {
    return entry && entry.path && entry.title;
  });
  let refs = meta.map(referencesEntries);
  refs = [].concat.apply([], refs); // flatten
  refs = addPathReferences(refs);
  refs = arrayToDictionary(refs);
  refs = sortDictionary(refs);
  return refs;
}

function makeReferencesJSON(files) {
  const refs = makeReferences(files);
  const json = JSONStringify(refs, null, 2, true);
  return json.trim() + '\n';
}

function addPathReferences(refs) {
  let pathRefs = refs.filter(function(ref) {
    return ref.href.match(/\/$/) && !ref.href.match(/^https?:/i);
  });
  pathRefs = pathRefs.map(function(ref) {
    return new Reference(
      referencePathName(ref.href),
      ref.href,
      ref.title,
      ref.hidden
    );
  });
  const newRefs = refs.concat(pathRefs);
  return newRefs;
}

function referencesEntries(entry) {
  const entryPath = entry.path;
  const title = entry.title;
  let summary =
    entry.title || entry.summary || entry.subtitle || entry.abstract;
  // summary = '';
  if (summary) {
    const render = true;
    // const render = false;
    summary = getSummary(entryPath, title, summary, render);
  }
  // extra properties
  const opts = {};
  if (entry.id) {
    opts.id = entry.id;
  }
  if (entry.tags) {
    opts.tags = entry.tags;
  }
  const ref = new Reference(title, entryPath, summary, entry.hidden, opts);
  const aliases = referencesAliasEntries(entry, summary);
  const files = referencesFileEntries(entry, summary);
  const bookmarks = referencesBookmarkEntries(entry, summary);
  const refs = [ref]
    .concat(aliases)
    .concat(files)
    .concat(bookmarks);
  console.log('Indexed ' + entry.path);
  return refs;
}

function getSummary(entryPath, title, summary, forceRender) {
  return (
    (!forceRender && getCachedSummary(title, entryPath)) ||
    renderSummary(summary)
  );
}

function renderSummary(summary) {
  return summary ? mdToText(summary) : '';
}

// FIXME: is caching still necessary now that the code is optimized?
function getCachedSummary(label, href) {
  const normLabel = normalizeLabel(label);
  const ref = getReference(function(r) {
    return r.label === normLabel && r.href === href;
  });
  return (ref && ref.title) || '';
}

function referencesBookmarkEntries(entry, summary) {
  const fixedEntry = entry || {};
  const refs = [];
  if (fixedEntry.export) {
    fixedEntry.references = fixedEntry.export;
  }
  if (fixedEntry.index) {
    fixedEntry.references = fixedEntry.index;
  }
  if (fixedEntry.url) {
    const href = fixedEntry.url;
    fixedEntry.references = fixedEntry.references || {};
    fixedEntry.references[href] = '.';
  }
  if (fixedEntry.urls) {
    fixedEntry.references = fixedEntry.references || {};
    fixedEntry.urls.forEach(href => {
      fixedEntry.references[href] = '.';
    });
  }
  if (fixedEntry.references) {
    if (!Array.isArray(fixedEntry.references)) {
      const refsArray = [];
      Object.keys(fixedEntry.references).forEach(function(title) {
        const refUrl = fixedEntry.references[title];
        const ref = {
          title: title,
          url: refUrl
        };
        refsArray.push(ref);
      });
      fixedEntry.references = refsArray;
    }
    fixedEntry.references.forEach(function(r) {
      const label = r.title;
      const href = urlResolve(fixedEntry.path, r.url);
      const title = isExternalUrl(r.url)
        ? r.title || summary || fixedEntry.title
        : summary || fixedEntry.title || r.title;
      const ref = new Reference(label, href, title, fixedEntry.hidden);
      refs.push(ref);
    });
  }
  return refs;
}

function referencesFileEntries(entry, summary) {
  const refSummary = summary || entry.summary;
  const files = [];

  if (entry.file) {
    const fileName = path.basename(entry.file);
    const withoutExt = fileNameWithoutExtension(fileName);
    const withoutDashes = fileNameWithoutDashes(withoutExt);

    files.push(new Reference(fileName, entry.path, refSummary, entry.hidden));
    files.push(new Reference(withoutExt, entry.path, refSummary, entry.hidden));
    files.push(
      new Reference(withoutDashes, entry.path, refSummary, entry.hidden)
    );
  }

  return files;
}

function referencePathName(pathStr) {
  const defaultSegment = 'Index';
  const pathSegments = pathStr.split('/');
  if (!pathSegments) {
    return defaultSegment;
  }
  if (pathStr.match(/\/$/)) {
    pathSegments.pop();
  }
  if (!pathSegments) {
    return defaultSegment;
  }
  let lastSegment = pathSegments[pathSegments.length - 1];
  lastSegment = lastSegment || defaultSegment;
  lastSegment = _.capitalize(lastSegment);
  return lastSegment;
}

function fileNameWithoutExtension(file) {
  return path.basename(file, path.extname(file));
}

function fileNameWithoutDashes(file) {
  return file.replace(/[-_]+/g, ' ');
}

function forEachPromise(arr, fn) {
  const result = [];
  let ready = Promise.resolve(null);
  arr.forEach(function(entry) {
    ready = ready
      .then(function() {
        return fn(entry);
      })
      .then(function(value) {
        result.push(value);
      })
      .catch(function() {});
  });
  return ready.then(function() {
    return result;
  });
}

async function processFiles() {
  const [mdFiles, yamlFiles] = await Promise.all([
    iterateOverMarkdown('.', convertFile),
    iterateOverYaml('.')
  ]);
  const files = mdFiles.sort().concat(yamlFiles.sort());
  writeReferences(files);
}

function iterateOverMarkdown(dir, fn, options) {
  return iterateOverFiles(
    ['**/' + settings.index, '**/' + settings.index + '.asc'],
    dir,
    fn,
    options
  );
}

function iterateOverYaml(dir, fn, options) {
  return iterateOverFiles(['**/*.yml'], dir, fn, options);
}

async function iterateOverFiles(patterns, dir, fn, options) {
  const files$ = filesInDirectory(patterns, dir, options);
  return iterateOverStream(files$, fn, options);
}

function iterateOverStream(stream$, fn, options) {
  return new Promise((resolve, reject) => {
    const files = [];
    const iterator = fn || (x => x);
    const iteratorPromise = (x, opts) => Promise.resolve(iterator(x, opts));
    const concurrent = (options && options.concurrent) || 10;
    const subscription = stream$
      .pipe(RxOp.mergeMap(entry => iteratorPromise(entry, options), concurrent))
      .subscribe(
        file => {
          files.push(file);
        },
        null,
        () => {
          subscription.unsubscribe();
          resolve(files);
        }
      );
  });
}

function filesInDirectory(patterns, dir, options) {
  const ignore = (options && options.ignore) || ['node_modules/**'];
  const stream$ = new Rx.Subject();
  const cwd = (options && options.cwd) || '.';
  const concurrentFiles = (options && options.concurrent) || 1;
  const directory = joinPaths(cwd, dir);
  const stream = fg.stream(patterns, {
    dot: true,
    ignore: ignore,
    cwd: directory
  });
  stream.on('data', entry => {
    // const file = path.join(directory, entry);
    const file = entry;
    stream$.next(file);
  });
  stream.once('end', () => stream$.complete());
  return stream$;
}

function writeReferences(files) {
  return new Promise(function(resolve, reject) {
    const refs = makeReferences(files);
    const yml = '---\n' + yaml.safeDump(refs).trim();
    fs.writeFile(referencesPathYaml, yml, function(err) {
      if (err) {
        reject(err);
      } else {
        fs.writeFile(sitemapPathYaml, yml, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(refs);
          }
        });
        resolve(refs);
      }
    });
    // const json = JSONStringify(refs, null, 2, true).trim() + '\n';
    // fs.writeFile(referencesPath, json, function(err) {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve(refs);
    //   }
    // });
  });
}

function referencesAliasEntries(entry, summary) {
  const refSummary = summary || entry.summary;
  const aliases = [];
  // const plainTextTitle = mdToAscii(entry.title);
  // if (plainTextTitle !== entry.title) {
  //   const plainTextRef = new Reference(
  //     plainTextTitle,
  //     entry.path,
  //     refSummary,
  //     entry.hidden
  //   );
  //   aliases.push(plainTextRef);
  // }
  const punctuationRegexp = /[\s*[!?.;:]+$/i;
  const endsWithPunctuation = entry.title.match(punctuationRegexp);
  // if (endsWithPunctuation) {
  //   let simpleTitle = entry.title.replace(punctuationRegexp, '')
  //   let simpleRef = new Reference(simpleTitle, entry.path, refSummary, entry.hidden)
  //   aliases.push(simpleRef)
  // }
  if (entry.subtitle) {
    const delimiter = endsWithPunctuation ? ' ' : ': ';
    const title = entry.title + delimiter + entry.subtitle;
    const extraRef = new Reference(title, entry.path, refSummary, entry.hidden);
    aliases.push(extraRef);
  }
  if (entry.aliases) {
    entry.aliases.forEach(function(alias) {
      const aliasRef = new Reference(
        alias,
        entry.path,
        refSummary,
        entry.hidden
      );
      aliases.push(aliasRef);
    });
  }
  if (entry.url && entry.url !== entry.path) {
    const urlRef = new Reference(
      entry.url,
      entry.path,
      refSummary,
      entry.hidden
    );
    aliases.push(urlRef);
  }
  if (entry.id) {
    const idRef = new Reference(
      'id:' + entry.id,
      entry.path,
      refSummary,
      entry.hidden
    );
    aliases.push(idRef);
  }
  return aliases;
}

function joinPaths(dir, file) {
  const directory = path.resolve(dir);
  let filePath = file;
  if (path.isAbsolute(filePath)) {
    filePath = path.relative(directory, filePath);
  }
  return path.join(directory, filePath);
}

function main() {
  if (process.argv.length > 2) {
    const input = process.argv[2] || settings.index;
    const output = process.argv[3] || htmlfile(input);
    convert(input, output);
  } else {
    processFiles();
  }
}

main();
