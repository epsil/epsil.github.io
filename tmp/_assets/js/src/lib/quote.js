import $ from 'jquery';

export function addBootstrapDivs() {
  return this.each(function() {
    $(this)
      .find('blockquote[class]')
      .filter(function() {
        return $(this).hasClass('bs-callout');
      })
      .each(function() {
        const blockquote = $(this);
        const strong = blockquote.find('>:first-child > strong');
        if (strong.length) {
          const p = strong.parent();
          if (strong.length && p.text() === strong.text()) {
            const header = $('<h4>');
            header.html(strong.html());
            p.replaceWith(header);
          }
        }
        const div = blockquote
          .prop('outerHTML')
          .trim()
          .replace(/^<blockquote/i, '<div')
          .replace(/blockquote>$/i, 'div>');
        blockquote.replaceWith(div);
      });
  });
}

export function addPullQuotes() {
  return this.map(function() {
    return $(this)
      .find('p.pull-quote, blockquote p.left, blockquote p.right')
      .each(function() {
        const p = $(this);
        let blockquote = p.parent();
        if (blockquote.prop('tagName') !== 'BLOCKQUOTE') {
          blockquote = p.wrap('<blockquote>').parent();
        }
        const aside = blockquote.wrap('<aside>').parent();
        aside.addClass(p.attr('class'));
        p.removeAttr('class');
      });
  });
}

export function fixBlockquotes() {
  return this.each(function() {
    $(this)
      .find('blockquote > p:last-child')
      .each(function() {
        const p = $(this);
        const blockquote = p.parent();
        if (
          p
            .text()
            .trim()
            .match(/^[\u2013\u2014]/)
        ) {
          p.find('em, i').replaceWith(function() {
            return $('<cite>' + $(this).html() + '</cite>');
          });
          const html = p.html().substr(1);
          const footer = $('<footer>' + html + '</footer>');
          p.replaceWith(footer);
          blockquote.addClass('epigraph');
        }
      });
  });
}

if ($ && $.fn) {
  $.fn.addBootstrapDivs = addBootstrapDivs;
  $.fn.addPullQuotes = addPullQuotes;
  $.fn.fixBlockquotes = fixBlockquotes;
}

export default {
  addBootstrapDivs,
  addPullQuotes,
  fixBlockquotes
};
