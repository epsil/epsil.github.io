/**
 * # Site generator
 *
 * Simple site generator implementation.
 *
 * Scans the current directory tree for `.md` files
 * and converts them to HTML.
 */

const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

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
function parsePage(input, path) {
  const grayMatterObject = matter(input);
  const markdown = grayMatterObject.content.trim();
  const html = parseMarkdown(markdown);
  const result = {
    content: { markdown: markdown, html: html },
    metadata: {
      ...grayMatterObject.data,
      path: path,
      yaml: grayMatterObject.data,
    },
  };
  // TODO: Extract initial h1 element if there is
  // no YAML title.
  return result;
}

module.exports = {
  md,
  parsePage,
  parseMarkdown,
};
