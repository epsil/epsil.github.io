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

module.exports = { template };
