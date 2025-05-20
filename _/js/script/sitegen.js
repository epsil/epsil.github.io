/**
 * # Site generator
 *
 * Simple site generator implementation.
 *
 * Scans the current directory tree for `.md` files
 * and converts them to HTML.
 */

const matter = require('gray-matter');
const minimist = require('minimist');
const buildOptions = require('minimist-options');
const fg = require('fast-glob');
const { readFileSync, writeFileSync } = require('fs');
const MarkdownIt = require('markdown-it');

// import {basename, dirname, extname, isAbsolute, join, relative} from 'path';
const { basename, dirname, extname, join } = require('path');

const md = new MarkdownIt({});

/**
 * Parse a Markdown string, returning an HTML string.
 */
function parseMarkdown(input) {
  let result = '';
  try {
    result = md.render(input).trim();
  } catch (err) {}
  return result;
}

/**
 * Parse a Markdown string, returning a page object.
 */
function parsePage(input) {
  const grayMatterObject = matter(input);
  const markdown = grayMatterObject.content.trim();
  const html = parseMarkdown(markdown);
  const result = {
    content: { markdown: markdown, html: html },
    metadata: { ...grayMatterObject.data, yaml: grayMatterObject.data },
  };
  // TODO: Extract initial h1 element if there is
  // no YAML title.
  return result;
}

/**
 * *Very* simple HTML template (will need to do
 * a whole lot more than this). Takes a page object
 * and returns a string.
 */
function template(obj) {
  return `<!DOCTYPE html>
<html>
<head>
<title>${obj.metadata.title || ''}</title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<meta content="text/css" http-equiv="Content-Style-Type">
<meta content="width=device-width, initial-scale=1" name="viewport">
</head>
<body>
${obj.content.html}
</body>
</html>`;
}

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

    const page = parsePage(markdown);
    // console.log(page);

    const html = template(page);
    console.log(html);
    console.log();
  }
}

// Run `main` function.
main();
