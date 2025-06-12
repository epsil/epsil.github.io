/**
 * # Site generator
 *
 * Simple site generator implementation.
 *
 * Scans the current directory tree for `.md` files
 * and converts them to HTML.
 */

const fg = require('fast-glob');
const { mkdirSync, readFileSync, writeFileSync } = require('fs');
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
  let exclude = flags['exclude'] || [];
  // Handle minimist quirk: a single value is not represented as an array.
  exclude = Array.isArray(exclude) ? exclude : [exclude];
  const ignore = ['node_modules', ...exclude];

  const entries = fg.sync(['**/*.md'], {
    dot: false,
    ignore: ignore,
  });

  for (entry of entries) {
    const mdPath = entry;
    const mdDir = dirname(mdPath);
    console.log(mdPath);

    const htmlPath = MDPathToHTMLPath(entry);
    const htmlDir = dirname(htmlPath);
    console.log(htmlPath);
    console.log();

    const markdown = readFileSync(entry, { encoding: 'utf8' });
    console.log(markdown);
    console.log();

    const page = parsePage(markdown, mdPath, htmlPath);

    const html = template(page);
    mkdirSync(htmlDir, { recursive: true });
    writeFileSync(htmlPath, html, { encoding: 'utf8' });
    console.log(html);
    console.log();
  }
}

// Run `main` function.
main();
