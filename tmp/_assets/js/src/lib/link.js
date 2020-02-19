import $ from 'jquery';
import URI from 'urijs';
import { isLocalFile } from './page';
import {
  getCachedUrlRef,
  isExternalUrl,
  urlAnchor,
  urlPlusIndexHtml,
  urlRelative,
  urlWithoutAnchor
} from './util';

export function fixLinks() {
  return this.each(function() {
    const body = $(this);
    // fix internal links
    body.find('a[href^="#"]').each(function() {
      const link = $(this);
      const href = link.attr('href').replace(':', '\\:');
      const title = link.attr('title');
      // ignore aria-hidden anchors
      if (
        link.attr('aria-hidden') === 'true' ||
        href === '#' ||
        (title !== undefined && title !== '')
      ) {
        return;
      }
      let target = body.find(href);
      if (target.length <= 0) {
        return;
      }
      // set title attribute to summary of target
      target = target.first();
      let text = target.removeAria().text() || '';
      text = text.trim();
      link.attr('title', text);
    });
    // fix external links
    body.find('a').each(function() {
      const a = $(this);
      let text = a.text() || '';
      text = text.trim();
      let href = a.attr('href') || '';
      href = href.trim();
      if (href === undefined || href === '') {
        // not a link: do nothing
        return;
      }
      // add .url class for URL links
      if (
        text !== '' &&
        text.match(/[a-z]+:\//i) &&
        (text === href ||
          text.match(/^[a-z]+:\//i) ||
          text === decodeURIComponent(href))
      ) {
        a.addClass('url');
        if (isExternalUrl(href)) {
          a.text(decodeURIComponent(href));
        }
      }
      // add index.html to end of link
      if (
        isLocalFile() &&
        !isExternalUrl(href) &&
        urlWithoutAnchor(href).match(/\/$/)
      ) {
        href = urlPlusIndexHtml(href);
        a.attr('href', href);
      }
      // open external links in a new window
      if (a.hasClass('external') || isExternalUrl(href)) {
        // add explanatory tooltip
        const host = URI(href)
          .host()
          .replace(/^www\./, '');
        if (!a.is('[title]')) {
          const str = 'External link to ' + host + ' (opens in a new window)';
          a.attr('title', str.replace(/[ ]+/g, ' '));
        }
        // set target="_blank"
        a.attr('target', '_blank');
        // https://mathiasbynens.github.io/rel-noopener/
        if (isExternalUrl(href)) {
          a.attr('rel', 'noopener noreferrer');
        }
      }
      // add tooltip for mailto: links
      if (href.match(/^mailto:/i) && !a.is('[title]')) {
        const mail = href.replace(/^mailto:/i, '');
        a.attr('title', 'E-mail ' + mail);
        a.addClass('mail');
      }
    });
  });
}

// similar to Hakyll's relativizeUrls
export function relativizeUrls(pathStr, refs) {
  return this.each(function() {
    $(this)
      .find('a[href]')
      .each(function() {
        const a = $(this);
        let href = a.attr('href');
        if (!a.hasClass('u-url') && !a.hasClass('external')) {
          // redirect external links to local copy
          const ref = getCachedUrlRef(href, refs);
          if (ref) {
            const title = 'Cached version of ' + href;
            const hash = urlAnchor(href);
            const refHasAnchor = urlAnchor(ref.href) !== '';
            href = ref.href + (refHasAnchor ? '' : hash);
            a.attr('href', href);
            a.attr('title', a.attr('title') || title || '');
          }
        }
        // make URL relative
        href = urlRelative(pathStr, href);
        a.attr('href', href);
      });
    $(this)
      .find('img[src]')
      .each(function() {
        const img = $(this);
        let src = img.attr('src');
        src = urlRelative(pathStr, src);
        img.attr('src', src);
      });
  });
}

if ($ && $.fn) {
  $.fn.fixLinks = fixLinks;
  $.fn.relativizeUrls = relativizeUrls;
}

export default {
  fixLinks,
  relativizeUrls
};
