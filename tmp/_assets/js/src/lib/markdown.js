import $ from 'jquery';
import markdownit from 'markdown-it';
import attr from 'markdown-it-attrs';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import figures from 'markdown-it-implicit-figures';
import taskcheckbox from 'markdown-it-task-checkbox';
import deflist from 'markdown-it-deflist';
import emoji from 'markdown-it-emoji';
import mathjax from 'markdown-it-mathjax';
import abbr from 'markdown-it-abbr';
import container from 'markdown-it-container';
import _ from 'lodash';
import prism from './prism';
import {
  mdPath as markdownPath,
  pgpPath as encryptedMarkdownPath
} from './page';
import { preprocessor } from './preprocessor';
import {
  extractReferencesFromMarkdown,
  mergeDictionaries,
  removeUnsafeReferences
} from './reference';
import { toAscii } from './util';
import { dojQuery, htmlToText, htmlToJSXFragment } from './util-dom';

export const defaults = {
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: true

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre..., internal wrapper is skipped.
  // highlight: highlightBlock
};

export function mdPath() {
  return markdownPath;
}

export function pgpPath() {
  return encryptedMarkdownPath;
}

export function markdown(str, opts) {
  let mdStr = preprocessor(str);
  const mdOpts = options(opts || {});
  let mdParser = md;
  if (mdOpts && !_.isEmpty(mdOpts)) {
    mdParser = parser(mdOpts);
  }
  const envObj = env(
    _.assign({}, mdOpts, {
      // ensure that file-defined references have precedence
      // over wiki references
      references: mergeDictionaries(
        mdOpts.references,
        extractReferencesFromMarkdown(mdStr, mdOpts.references)
      )
    })
  );
  mdStr = mdParser.render(mdStr, envObj);
  mdStr = mdStr.trim();
  // mdStr = highlightInline(mdStr).trim();
  if (mdOpts && mdOpts.inline && mdStr.match(/^<p>/) && mdStr.match(/<\/p>$/)) {
    const beg = '<p>'.length;
    const end = '</p>'.length;
    mdStr = mdStr.substring(beg, mdStr.length - end);
  }
  return mdStr;
}

export function env(obj) {
  const mdEnv = _.assign({ references: {} }, obj);
  mdEnv.references = removeUnsafeReferences(mdEnv.references);
  return mdEnv;
}

// export function highlightBlock(str, lang) {
//   if (lang && hljs.getLanguage(lang)) {
//     try {
//       return hljs.highlight(lang, str, true).value;
//     } catch (__) {}
//   }
//   return '';
// }

// export function highlightInline(str) {
//   return dojQuery(str, function(body) {
//     body.find('code[class]').each(function() {
//       let code = $(this);
//       let pre = code.parent();
//       if (pre.prop('tagName') === 'PRE') {
//         return;
//       }
//       let lang = code.attr('class');
//       if (lang && hljs.getLanguage(lang)) {
//         try {
//           code.removeClass(lang);
//           code.addClass('language-' + lang);
//           let str = code.text().trim();
//           let html = hljs.highlight(lang, str, false).value;
//           code.html(html);
//         } catch (__) {}
//       }
//     });
//   });
// }

export function options(opts) {
  const newOpts = _.assign({}, opts);
  if (newOpts.hard_line_breaks !== undefined) {
    newOpts.breaks = newOpts.hard_line_breaks;
    delete newOpts.hard_line_breaks;
  }
  if (newOpts.autolink_bare_uris !== undefined) {
    newOpts.linkify = newOpts.autolink_bare_uris;
    delete newOpts.autolink_bare_uris;
  }
  return newOpts;
}

export function parser(opts) {
  let mdOpts = opts || {};
  mdOpts = _.assign({}, defaults, mdOpts);
  return plugins(markdownit(mdOpts), mdOpts);
}

export function plugins(md, opts) {
  const mdOpts = opts || {};
  let mdInstance = md.use(figures, { figcaption: true });
  // if (opts.mathjax !== true) {
  mdInstance = mdInstance.use(attr);
  // }
  mdInstance = mdInstance
    .use(sub)
    .use(sup)
    .use(footnote)
    .use(taskcheckbox, { disabled: false })
    .use(deflist);
  mdInstance = containerPlugin(mdInstance);
  if (mdOpts.emoji === true) {
    mdInstance = mdInstance.use(emoji);
    mdInstance.renderer.rules.emoji = function(token, idx) {
      return (
        '<span class="emoji emoji_' +
        token[idx].markup +
        '">' +
        token[idx].content +
        '</span>'
      );
    };
  }
  if (mdOpts.mathjax === true) {
    mdInstance = mdInstance.use(mathjax());
  }
  mdInstance = mdInstance.use(abbr);
  mdInstance = mdInstance.use(prism);
  return mdInstance;
}

export function containerPlugin(md) {
  const renderContainer = function(bsClass, title) {
    return function(tokens, idx) {
      const info = tokens[idx].info.trim();
      const bsClassName = bsClass || info.toLowerCase();
      const titleStr = title || _.capitalize(info);
      const isOpeningTag = tokens[idx].nesting === 1;
      return isOpeningTag
        ? '<div class="bs-callout bs-callout-' +
            bsClassName +
            '"><h4>' +
            titleStr +
            '</h4>\n'
        : '</div>\n';
    };
  };
  return md
    .use(container, 'default', { render: renderContainer() })
    .use(container, 'primary', { render: renderContainer() })
    .use(container, 'success', { render: renderContainer() })
    .use(container, 'info', { render: renderContainer() })
    .use(container, 'warning', { render: renderContainer() })
    .use(container, 'danger', { render: renderContainer() })
    .use(container, 'viktig', { render: renderContainer('warning') })
    .use(container, 'advarsel', { render: renderContainer('danger') })
    .use(container, 'note', { render: renderContainer('info') });
}

export function mdInline(str, opts) {
  return markdown(str, { ...opts, inline: true });
}

export function mdInlineJSX(str, opts) {
  return htmlToJSXFragment(mdInline(str, opts));
}

export function mdToJSX(str, opts) {
  return htmlToJSXFragment(markdown(str, opts));
}

export function mdToText(str, opts) {
  const html = mdInline(str, opts);
  return htmlToText(html);
}

export function mdToAscii(str, opts) {
  return toAscii(mdToText(str, opts));
}

export const md = parser();

export default {
  defaults,
  mdPath,
  pgpPath,
  markdown,
  env,
  options,
  parser,
  plugins,
  containerPlugin,
  mdInline,
  mdInlineJSX,
  mdToJSX,
  mdToText,
  md
};
