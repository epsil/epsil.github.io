const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

// import MarkdownIt from 'markdown-it';
const mathjax = require('markdown-it-mathjax');
// const wikilinks = require('markdown-it-wikilinks');
const footnote = require('markdown-it-footnote');
const sub = require('markdown-it-sub');
const sup = require('markdown-it-sup');
const attrs = require('markdown-it-attrs');

// const md = new MarkdownIt({});
const md = new MarkdownIt({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: false, // Autoconvert URL-like text to links
  // Enable some language-neutral replacement + quotes beautification
  // For the full list of replacements, see
  // <https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js>
  typographer: true,
})
  // .use(
  //   wikilinks({
  //     postProcessLabel: parseMarkdownInline,
  //     postProcessPageName: (name: string): string =>
  //       defaultPostProcessPageName(name),
  //     relativeBaseURL: '',
  //     uriSuffix: '',
  //   })
  // )
  .use(footnote)
  .use(sub)
  .use(sup)
  .use(mathjax())
  .use(attrs);

/**
 * Simplify `pre` elements.
 */
function fixPreElements(html) {
  return html
    .replace(/^<pre><code>/gm, '<pre>')
    .replace(/\n<\/code><\/pre>/gm, '</pre>');
}

/**
 * Parse a Markdown string, returning an HTML string.
 */
function parseMarkdown(input) {
  let result = '';
  try {
    result = md.render(input);
  } catch (err) {}
  result = result.trim();
  result = fixPreElements(result);
  return result;
}

/**
 * Parse a Markdown string, returning a page object.
 */
function parsePage(input, mdPath, htmlPath) {
  const grayMatterObject = matter(input);
  const markdown = grayMatterObject.content.trim();
  const html = parseMarkdown(markdown);
  const result = {
    content: { markdown: markdown, html: html },
    metadata: {
      ...grayMatterObject.data,
      htmlPath: htmlPath,
      mdPath: mdPath,
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
