/**
 * # Site generator
 *
 * Simple site generator implementation.
 *
 * Scans the current directory tree for `.md` files
 * and converts them to HTML.
 */

const minimist = require('minimist');
const buildOptions = require('minimist-options');
const fg = require('fast-glob');

// import {basename, dirname, extname, isAbsolute, join, relative} from 'path';
const { basename, dirname, extname, join } = require('path');

/**
 * Command line options. Passed to
 * [`minimist-options`][npm:minimist-options]
 * for parsing.
 *
 * [npm:minimist-options]: https://www.npmjs.com/package/minimist-options
 */
const cliOptions = {
  exclude: {
    alias: 'e',
    type: 'string-array',
  },
};

function MDPathToHTMLPath(path) {
  if (path === 'index.md') {
    return 'index.html';
  } else {
    return path.replace(/\.md$/, '.html');
  }
}

function MDPathToHTMLPath_v2(path) {
  if (path === 'index.md') {
    return 'index.html';
  } else {
    const dir = dirname(path);
    const file = basename(path);
    const ext = extname(path);
    const stem = basename(file, ext);
    return join(dir, stem, 'index.html');
  }
}

function MDPathToHTMLPath_v3(path) {
  if (path === 'index.md') {
    return 'index.html';
  } else {
    const dirpath = dirname(path);
    const dir = basename(dirpath);
    const file = basename(path);
    const ext = extname(path);
    const stem = basename(file, ext);
    if (dir === stem) {
      return join(dirpath, 'index.html');
    } else {
      return join(dirpath, stem, 'index.html');
    }
  }
}

/**
 * `main` function.
 */
function main() {
  const flags = minimist(process.argv.slice(2), buildOptions(cliOptions));
  let exclude = flags['exclude'];

  // minimist does *not* explicitly support array type options.
  // If you set an option multiple times, it will indeed yield
  // an array of values. However, if you only set it once, it will
  // simply give the value as is, without wrapping it in an array.
  if (!exclude) {
    exclude = [];
  } else if (typeof exclude === 'string') {
    exclude = [exclude];
  }

  // console.log('flags: ', flags);
  // console.log('exclude: ', exclude);

  const entries = fg.sync(['**/*.md'], {
    dot: false,
    ignore: ['node_modules'],
  });

  // console.log(entries);

  for (entry of entries) {
    console.log(entry);
    // console.log(MDPathToHTMLPath(entry));
    // console.log(MDPathToHTMLPath_v2(entry));
    console.log(MDPathToHTMLPath_v3(entry));
    console.log();
  }
}

// Run `main` function.
main();
