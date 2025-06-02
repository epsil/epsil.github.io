const { basename, dirname, extname, join, relative } = require('path');

const { tidy_html5 } = require('tidy-html5');

function formatHTML(html) {
  return tidy_html5(html, {
    'drop-empty-elements': false,
    indent: false, // true
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
    wrap: 0,
  });
}

/**
 * *Very* simple HTML template (will need to do
 * a whole lot more than this). Takes a page object
 * and returns a string.
 */
function template(page) {
  const cssPath = relative(dirname(page.metadata.htmlPath), '_/css/style.css');
  console.log(cssPath);
  let result = `<!DOCTYPE html>
<html>
<head>
<title>${page.metadata.title || ''}</title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
<meta content="text/css" http-equiv="Content-Style-Type">
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="${cssPath}" rel="stylesheet">
</head>
<body>
${page.content.html}
</body>
</html>`;
  result = formatHTML(result);
  return result;
}

module.exports = { template };
