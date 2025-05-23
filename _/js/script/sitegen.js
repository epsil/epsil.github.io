/**
 * # Site generator
 *
 * Simple site generator implementation.
 *
 * Scans the current directory tree for `.md` files
 * and converts them to HTML.
 */

const fg = require('fast-glob');
const { readFileSync, writeFileSync } = require('fs');
const minimist = require('minimist');
const buildOptions = require('minimist-options');
const { basename, dirname, extname, join } = require('path');
const { parsePage } = require('./markdown');
const { template } = require('./template');

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

/**
 * Convert Markdown path to HTML path---i.e., convert
 * `path/to/markdown.md` to `path/to/hypertext.html`.
 */
function MDPathToHTMLPath(path) {
  const dirpath = dirname(path);
  const file = basename(path);
  if (file === 'index.md') {
    return join(dirpath, 'index.html');
  } else {
    const dir = basename(dirpath);
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
    const mdPath = MDPathToHTMLPath(entry);
    console.log(mdPath);
    console.log();

    // TODO: Create directory if necessary...
    const markdown = readFileSync(entry, { encoding: 'utf8' });
    // writeFileSync(mdPath, markdown, { encoding: 'utf8' });
    console.log(markdown);
    console.log();

    const page = parsePage(markdown, entry);
    // console.log(page);

    const html = template(page);
    console.log(html);
    console.log();
  }
}

// Run `main` function.
main();
