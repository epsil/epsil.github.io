const { dirname, relative } = require('path');
const { formatHTML } = require('./tidy');

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
  // result = fixPreElements(result);
  result = formatHTML(result);
  return result;
}

module.exports = { template };
