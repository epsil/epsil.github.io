import matter from 'gray-matter';
import md5 from 'md5';
import $ from 'jquery';
import _ from 'lodash';
import { amp, caps, initQuotes, ord, smartypants, widont } from 'typogr';
import { markdown } from './markdown';
import { bitbucket, facebook, github, linkedin, mail, twitter } from './social';
import { dojQuery } from './util-dom';
import settings from '../../../yml/json/settings.json';
import './abbrev'; // addAcronyms, addSmallCaps
import './anchor'; // addAnchors
import './center'; // fixCenteredText
import './collapse'; // addCollapsibleElements, collapseDoneItems
import './figure'; // fixFigures
import './footnote'; // fixFootnotes, addSidenotes
import './id'; // addIdAttributeToAllElements
import './kbd'; // addHotkeys
import './link'; // fixLinks, relativizeUrls
import './math'; // addFormulas, addTeXLogos
import './mark'; // fixMarks
import './punctuation'; // fixWidont, addPunctuation
import './quote'; // addBootstrapDivs, addPullQuotes, fixBlockquotes
import './section'; // addSections
import './table'; // fixTables
import './toc'; // tableOfContents
import './clipboard'; // addClipboardButtons

export function parse(data, options) {
  // Allow the initial '---' to be omitted.
  // Note: this hack does not allow the block
  // to contain blank lines, although YAML
  // does support such expressions!
  let view = _.assign({}, options);
  let dataStr = data;
  if (!dataStr.match(/^---/) && dataStr.match(/^([\s\S]*)[\r\n]+---/)) {
    dataStr = '---\n' + dataStr;
  }
  const references = view.references;
  view = _.assign({}, view, matter(dataStr));
  const props = view.data;
  view = _.assign(view, props);
  if (references) {
    // the YAML 'references' property uses a format that is
    // different from markdown-it's 'references' object
    view.references = references;
  }
  view.content = markdown(view.content, view);
  return view;
}

export function addArrays(view) {
  const v = view;
  if (v.css && !Array.isArray(v.css)) {
    v.css = [v.css];
  }
  if (v.stylesheet && !Array.isArray(v.stylesheet)) {
    v.stylesheet = [v.stylesheet];
  }
  if (v.js && !Array.isArray(v.js)) {
    v.js = [v.js];
  }
  if (v.script && !Array.isArray(v.script)) {
    v.script = [v.script];
  }
  return v;
}

export function addI18n(view) {
  const v = view;
  if (v.lang === undefined || v.lang === '' || settings[v.lang] === undefined) {
    v.lang = 'no';
  }
  return _.assign({}, settings[v.lang], v);
}

export function dynamic(view, path) {
  const v = _.assign(
    {
      bitbucket: bitbucket.url(path),
      'bitbucket-history': bitbucket.history.url(path),
      facebook: facebook.url(path),
      github: github.url(path),
      'github-edit': github.edit.url(path),
      'github-history': github.history.url(path),
      'github-raw': github.raw.url(path),
      linkedin: linkedin.url(path),
      twitter: twitter.url(path),
      mail: mail.url(path)
    },
    view
  );
  if (v.toc !== false) {
    v.toc = '<div id="toc-placeholder"></div>';
  }
  // if (v.content.match(/[\\][(]/g)) {
  //   v.mathjax = true
  // }
  if (v.mathjax) {
    // typogr.js doesn't work well with MathJax
    // https://github.com/ekalinin/typogr.js/issues/31
    v.typogr = false;
  }
  return v;
}

export function title(view) {
  const v = view;
  if (v.title === undefined || v.title === '') {
    v.content = dojQuery(v.content, function(body) {
      const heading = body.find('h1').first();
      if (heading.length > 0) {
        v.title = heading
          .removeAriaHidden()
          .html()
          .trim();
        heading.remove();
      }
    });
  }
  return v;
}

export function footnotes(view) {
  const v = view;
  if (v.sidenotes === undefined) {
    v.sidenotes = true;
  }
  if (v.footnotes === undefined || v.footnotes === '') {
    v.content = dojQuery(v.content, function(body) {
      const section = body.find('section.footnotes').first();
      if (section.length > 0) {
        const hr = body.find('hr.footnotes-sep');
        v.footnotes = section.html().trim();
        section.remove();
        hr.remove();
      }
    });
  }
  return v;
}

export function addToC(view) {
  const v = view;
  if (v.toc !== false) {
    v.content = dojQuery(v.content, function(body) {
      // let placeholder = body.find('#toc-placeholder');
      // let content = body.find('.e-content');
      // v.toc = content.tableOfContents();
      // if (v.toc !== '') {
      //   placeholder.replaceWith(v.toc);
      // }
      v.toc = body.tableOfContents();
    });
  }
  return v;
}

export function typography(view) {
  const v = view;
  // typogr.js doesn't understand unescaped quotation marks
  v.content = v.content
    .replace(/\u2018/gi, '&#8216;')
    .replace(/\u2019/gi, '&#8217;')
    .replace(/\u201c/gi, '&#8220;')
    .replace(/\u201d/gi, '&#8221;')
    // FIXME: this belongs in util.js
    .replace(/&#8220;&#8216;/gi, '&#8220;&nbsp;&#8216;')
    .replace(/&#8216;&#8220;/gi, '&#8216;&nbsp;&#8220;');
  if (v.typogr) {
    v.content = typogrify(v.content);
  }
  return v;
}

export function typogrify(text) {
  let txt = amp(text);
  // txt = widont(txt)
  txt = smartypants(txt);
  // fix typogr.js bugs
  txt = txt.replace(/>&#8220;([.,;:?!])/gi, '>&#8221;$1');
  txt = txt.replace(/-&#8217;/gi, '-&#8216;');
  // txt = caps(txt);
  txt = initQuotes(txt);
  txt = ord(txt);
  return txt;
}

export function links(view, path) {
  const v = view;
  if (v.plain !== true) {
    v.content = dojQuery(v.content, function(body) {
      body.relativizeUrls(path, view.references);
      body.fixLinks();
    });
  }
  return v;
}

export function process(html) {
  // html = markupPunctuation(html)
  return dojQuery(html, processBody);
}

export function processDOM() {
  return processBody($('body'));
}

export function processBody(body) {
  let content = body.find('.e-content');
  if (content.length <= 0) {
    content = body;
  }
  body.addIdAttributeToAllElements();
  body.fixWidont();
  body.addAcronyms();
  body.addSmallCaps();
  body.addClipboardButtons();
  body.addPullQuotes();
  body.fixCenteredText();
  body.fixFigures();
  body.fixMarks();
  body.addPunctuation();
  body.addHotkeys();
  body.addTeXLogos();
  body.addFormulas();
  content.addAnchors();
  body.fixBlockquotes();
  body.addBootstrapDivs();
  content.addCollapsibleElements();
  content.collapseDoneItems();
  body.fixFootnotes();
  body.addSidenotes();
  body.fixTables();
  body.fixLinks();
  content.addSections();
  body.addIdAttributeToAllElements(); // add to generated elements
}

export function processSimple(html) {
  return dojQuery(html, function(body) {
    const content = body.find('.e-content');
    if (content.length <= 0) {
      return;
    }
    body.fixWidont();
    body.fixCenteredText();
    body.fixFigures();
    body.fixMarks();
    body.addPunctuation();
    body.addHotkeys();
    body.addTeXLogos();
    body.fixBlockquotes();
    body.addBootstrapDivs();
    body.fixFootnotes();
    body.addSidenotes();
    body.fixTables();
    body.fixLinks();
  });
}

export function makeView(data, options) {
  let view = _.assign({}, options);
  const path = view.path;
  view = _.assign({}, settings, view);
  // view = _.assign({}, settings, view, {
  //   url: path
  // });

  view.orig = data.trim();
  return view;
}

export function parseMetadataInView(view, options) {
  // Allow the initial '---' to be omitted.
  // Note: this hack does not allow the block
  // to contain blank lines, although YAML
  // does support such expressions!
  let v = _.assign({}, view, options);
  if (!v.orig.match(/^---/) && v.orig.match(/^([\s\S]*)[\r\n]+---/)) {
    v.orig = '---\n' + v.orig;
  }
  const references = v.references;
  v = _.assign({}, v, matter(v.orig));
  const props = v.data;
  v = _.assign(v, props);
  if (references) {
    // the YAML 'references' property uses a format that is
    // different from markdown-it's 'references' object
    v.references = references;
  }
  v = addArrays(v);
  v.markdown = v.content;
  delete v.content;
  return v;
}

export function compileMarkdownInView(view, options) {
  const v = _.assign({}, view, options);
  v.content = markdown(v.markdown, v);
  return v;
}

export function processHtmlInView(view, options) {
  let v = _.assign({}, view, options);
  v.date = v.date || v.created;

  v = addI18n(v);
  v = dynamic(v, v.path);
  v = title(v);

  v = addToC(v);
  v = typography(v);
  v = links(v, v.path);

  if (v.plain) {
    v.content = processSimple(v.content);
  } else {
    v.content = process(v.content);
  }

  v = footnotes(v);

  return v;
}

export function compile(data, options) {
  let view = _.assign({}, options);
  const path = view.path;
  view = _.assign({}, settings, view);
  // view = _.assign({}, settings, view, {
  //   url: path
  // });

  const dataStr = data.trim();

  view = _.assign(view, parse(dataStr, view), {
    md5: md5(dataStr)
  });

  view.date = view.date || view.created;

  view = addArrays(view);
  view = addI18n(view);
  view = dynamic(view, path);
  view = title(view);

  view = addToC(view);
  view = typography(view);
  view = links(view, path);

  if (view.plain) {
    view.content = processSimple(view.content);
  } else {
    view.content = process(view.content);
  }

  view = footnotes(view);

  return view;
}

export default {
  parse,
  addArrays,
  addI18n,
  dynamic,
  title,
  footnotes,
  addToC,
  typography,
  typogrify,
  links,
  compile
};
