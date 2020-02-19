import React from 'react';
import ReactDOM from 'react-dom';
import Wiki from './components/Wiki';
import './lib/global';

function bootstrapWiki() {
  document.addEventListener('DOMContentLoaded', function(event) {
    const body = document.body;
    const div = document.createElement('div');
    body.appendChild(div);
    ReactDOM.render(<Wiki />, div);
  });
}

bootstrapWiki();

// /* global $:true, jQuery:true, MathJax */
// /* exported $, jQuery */
// $ = require('jquery');
// jQuery = $;
// require('datatables')();
// var URI = require('urijs');
// var md5 = require('md5');
// var openpgp = require('openpgp');
// var compile = require('./compile');
// var collapse = require('./collapse');
// var page = require('./page');
// var util = require('./util');
// var Reference = require('./reference');
//
// // TODO: the compiler should be required contingently as a chunk
// // (webpack?). There is no need to load it unless we are going to
// // regenerate the page because the MD5 checksum has changed.
//
// // enable MathJax rendering
// function typeset(document) {
//   addClickHandlers();
//   moveToHashOnLoad();
//   MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
//   return document;
// }
//
// // replace <body> with HTML converted from Markdown
// function convert(data) {
//   var head = $('head');
//   var body = $('body');
//   data = data.trim();
//
//   var checksum = head.find('meta[name=md5]').first();
//   if (checksum.length > 0 && checksum.attr('content') === md5(data)) {
//     // the source hasn't changed since it was last converted to HTML,
//     // so no need to convert it again
//     return $('html');
//   }
//
//   // the source has changed: regenerate the HTML
//   var html = compile(data, page.path());
//
//   // browser strips <html>, <head> and <body> tags
//   html = html
//     .replace('<head>', '<div class="head">')
//     .replace('</head>', '</div>')
//     .replace('<body>', '<div class="body">')
//     .replace('</body>', '</div>');
//   var doc = $('<div>').html(html);
//   var bodyDiv = doc.find('div.body');
//   body.html(bodyDiv.html());
//   var headDiv = doc.find('div.head');
//   headDiv.children().each(addToHead);
//   var updated = $('<meta content="1" name="updated">');
//   addHeadElement(updated);
//   return $('html');
// }
//
// // read Markdown from <iframe> or file and
// // insert the converted HTML into the document
// function loadData() {
//   var files = [];
//   var names = ['index'];
//   var extensions = ['.md', '.txt', '.md.asc', '.md.gpg', '.asc', '.gpg'];
//
//   var filename = URI(window.location.href).filename();
//   filename = filename.replace(/#[^#]*$/, '');
//   filename = filename.replace(/\.html$/, '');
//
//   if (filename && filename !== names[0]) {
//     names.unshift(filename);
//   }
//
//   names.forEach(function(name) {
//     extensions.forEach(function(ext) {
//       files.push(name + ext);
//     });
//   });
//
//   // Markdown has already been loaded once
//   var meta = $('meta[name=updated]');
//   if (meta.length > 0) {
//     return;
//   }
//
//   var iframe = $('iframe[type="text/markdown"]').first();
//   if (iframe.length > 0) {
//     // <body> contains <iframe src="index.txt">:
//     // replace <iframe> with its converted contents
//     loadIframe(iframe)
//       .then(insert)
//       .then(typeset);
//   } else {
//     // <body> contains no <iframe>: get file from <link> element
//     var link = $('link[type="text/markdown"]');
//     if (link.length > 0) {
//       files.unshift(link.attr('href'));
//     }
//     // replace <body> with converted data from file
//     // loadFile(file).then(insert).then(process).then(typeset)
//     loadFiles(files)
//       .then(insert)
//       .then(typeset);
//   }
// }
//
// $(function() {
//   insertStylesheet();
//   loadData();
// });
