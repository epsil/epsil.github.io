/* global jQuery:true */
/* exported jQuery */

/**
 * Collapsible headers, based on Bootstrap's collapse plugin.
 * Invoke with:
 *
 *     $('body').addCollapsibleSections()
 *
 * TODO:
 *
 *   - This code is extremely crufty as of now. It should be
 *     rewritten as a React component.
 *
 * Other points:
 *
 *   - Require bootstrap as a dependency: require('bootstrap').
 *   - Divide code into HTML pass and JavaScript pass:
 *     HTML pass should add Bootstrap attributes to headers,
 *     JavaScript pass should add click handlers.
 *     (perhaps JS could be replaced with CSS' :before/:after?).
 *   - Should the JavaScript pass be performed automatically?
 *     I.e., $(function () { ... }). Or will this cause problems
 *     if the code is used as a Node plugin?
 *   - Does the code style of Bootstrap's plugin provide any clues
 *     with regard to best practice?
 *   - Add code for collapsible lists.
 *   - Make links to collapsed elements auto-expand them
 *   - Option like Pandoc's --section-divs
 *     (or does this belong in a plugin of its own?)
 */

import $ from 'jquery';
import S from 'string';

// let jQuery = $; // needed for Bootstrap

import 'bootstrap';

/**
 * Return unique value
 */
export function unique(fn) {
  const results = [];
  return function(arg) {
    let result = fn(arg);
    let containsResult = results.indexOf(result.valueOf()) >= 0;
    if (containsResult) {
      let i = 1;
      let newResult = '';
      do {
        i++;
        newResult = result + '-' + i;
        containsResult = results.indexOf(newResult.valueOf()) >= 0;
      } while (containsResult);
      result = newResult;
    }
    results.push(result.valueOf());
    return result;
  };
}

/**
 * Generate element ID
 */
export function generateId(el, prefix) {
  return (prefix || '') + S(el.text().trim()).slugify();
}

/**
 * Generate unique element ID
 */
export const generateUniqueId = unique(generateId);

export function collapseDoneItems() {
  return this.each(function() {
    const body = $(this);
    body.find('s + ul.collapse.in, s + ol.collapse.in').each(function() {
      const ul = $(this);
      const buttonEl = ul.prevAll('.collapse-button').first();
      ul.removeClass('in');
      buttonEl.attr('aria-expanded', 'false');
    });
  });
}

/**
 * Add collapsible sections, lists and click handlers
 */
export function addCollapsibility() {
  return this.each(function() {
    const body = $(this);
    body.addCollapsibleElements();
    body.addCollapsibleHandlers();
  });
}

/**
 * Add collapsible sections and lists
 */
export function addCollapsibleElements() {
  return this.each(function() {
    const body = $(this);
    body.addCollapsibleSections();
    body.addCollapsibleLists();
  });
}

/**
 * Add collapsible click handlers
 */
export function addCollapsibleHandlers() {
  return this.each(function() {
    const body = $(this);
    body.find('.collapse-button').click(function() {
      const buttonEl = $(this);
      if (buttonEl.hasClass('empty')) {
        return false;
      }
      const id = buttonEl.attr('aria-controls');
      const path = window.location.href.replace(/#[^#]*$/i, '');
      const url = path + '#' + id;
      const expanded =
        buttonEl.attr('aria-expanded') === 'true' ? 'false' : 'true';
      if (typeof Storage !== 'undefined') {
        window.localStorage.setItem(url, expanded);
        window.sessionStorage.setItem(url, expanded);
      }
      return true;
    });
    body.find('.collapse-ellipsis').click(function() {
      const ellipsis = $(this);
      const buttonEl = ellipsis
        .prevAll()
        .filter('.collapse-button')
        .first();
      if (buttonEl.length) {
        buttonEl.click();
      }
      return false;
    });
  });
}

export function addLinkHandlers() {
  return this.each(function() {
    const body = $(this);
    body
      .find('a[href^="#"]')
      .filter(function() {
        return $(this).attr('aria-hidden') !== 'true';
      })
      .each(function() {
        try {
          const link = $(this);
          const href = link.attr('href').replace(':', '\\:');
          const target = $(href).first();

          if (target.length <= 0) {
            return;
          }

          link.click(function(event) {
            unhideElement(target);
          });
        } catch (err) {
          // swallow errors
        }
      });
  });
}

/**
 * Add collapsible lists
 */
export function addCollapsibleLists() {
  return this.each(function() {
    const body = $(this);
    body.find('ul > li').addCollapsibleListItem();
  });
}

/**
 * Add collapsible list item
 */
export function addCollapsibleListItem() {
  return this.each(function() {
    const li = $(this);
    const ul = li.find('> ol, > ul').first();
    if (ul.length > 0) {
      const prev = li.clone();
      prev.find('ol, ul').remove();
      let listId = li.attr('id');
      if (!listId) {
        listId = generateUniqueId(prev);
        li.attr('id', listId + '-item');
      }
      if (li.hasClass('x')) {
        li.addClass('collapse');
        li.removeClass('x');
      }
      if (
        prev
          .text()
          .trim()
          .match(/\[(\.\.\.|\u2026)\]$/)
      ) {
        li.addClass('collapse');
        let text = ul[0].previousSibling.nodeValue;
        text = text.replace(/\s*\[(\.\.\.|\u2026)\]\s*$/, '');
        ul[0].previousSibling.nodeValue = text;
      }
      addButton(li, ul, true, listId + '-list');
      li.append(
        '<a aria-hidden="true" class="collapse-ellipsis" href="#"></a>'
      );
    } else {
      let id = li.attr('id');
      if (!id) {
        id = generateUniqueId(li);
        li.attr('id', id + '-item');
      }
      // let span = li.wrapInner('<span>').children().first()
      const span = $('<span>');
      li.append(span);
      addButton(li, span, true);
      li.append(
        ' <a aria-hidden="true" class="collapse-ellipsis" href="#"></a>'
      );
    }
    const list = li.parent();
    if (!list.hasClass('collapse')) {
      list.addClass('collapse in');
    }
  });
}

/**
 * Add collapsible sections
 */
export function addCollapsibleSections(options) {
  const opts = $.extend({}, defaults, options);
  return this.each(function() {
    const body = $(this);
    // process innermost sections first
    $.each(['h6', 'h5', 'h4', 'h3', 'h2', 'h1'], function(i, el) {
      body.find(el).each(function() {
        // add section
        const header = $(this);
        const section = addSection(header);

        // skip top-level headers
        if ($.inArray(el, opts.include) < 0) {
          return;
        }

        // add button to header
        addButton(header, section);
        // add ellipsis to header
        header.append(
          '<a aria-hidden="true" class="collapse-ellipsis" href="#"></a>'
        );
      });
    });
  });
}

/**
 * Add collapsible content for header
 */
export function addSection(header) {
  // h1 ends at next h1, h2 ends at next h1 or h2,
  // h3 ends at next h1, h2 or h3, and so on
  const stop = [];
  const i = parseInt(header.prop('tagName').match(/\d+/)[0], 10);

  for (let j = 1; j <= i; j++) {
    stop.push('h' + j);
  }
  const end = stop.join(', ');
  let section = header.nextUntil(end);
  if (!section.length) {
    section = $('<div>').insertAfter(header);
  } else {
    section = section.wrapAll('<div>').parent();
  }
  sectionId(header, section);
  return section;
}

/**
 * Add button to header
 */
export function addButton(header, section, prepend, sectionIdStr) {
  // add button
  let id = sectionIdStr;
  if (id) {
    section.attr('id', id);
  } else {
    id = sectionId(header, section);
  }
  let buttonEl = button(id);
  if (prepend) {
    header.prepend(buttonEl);
  } else {
    header.append(buttonEl);
  }

  // add Bootstrap classes
  section.addClass('collapse in');
  if (section.text().trim() === '') {
    buttonEl.addClass('empty');
  }

  // allow pre-collapsed sections
  const path = window.location.href.replace(/#[^#]*$/i, '');
  const url = path + '#' + id;

  if (header.hasClass('x')) {
    header.addClass('collapse');
    header.removeClass('x');
  }
  if (
    header
      .text()
      .trim()
      .match(/\[(\.\.\.|\u2026)\]$/)
  ) {
    header.addClass('collapse');
    let html = header.html();
    html = html.replace(/\s*(&nbsp;)*\[(\.\.\.|\u2026)\]\s*/g, '');
    header.html(html);
    buttonEl = header.find('.collapse-button');
  }
  if (
    header.hasClass('collapse') ||
    (typeof Storage !== 'undefined' &&
      window.localStorage.getItem(url) === 'false')
  ) {
    header.removeClass('collapse').addClass('collapsed');
  }
  if (header.hasClass('collapsed')) {
    header.removeClass('collapsed');
    if (
      typeof Storage !== 'undefined' &&
      window.sessionStorage.getItem(url) !== 'true'
    ) {
      section.removeClass('in');
      buttonEl.attr('aria-expanded', 'false');
    }
  }
}

/**
 * Button
 */
export function button(id) {
  return $(
    '<a aria-hidden="true" aria-expanded="true" role="button" class="collapse-button" data-toggle="collapse" href="#' +
      id +
      '" aria-controls="' +
      id +
      '"></a>'
  );
}

/**
 * Header ID (add if missing)
 */
export function headerId(header) {
  let id = header.attr('id');
  if (id === undefined || id === '') {
    id = generateUniqueId(header);
    header.attr('id', id);
  }
  return id;
}

/**
 * Section ID (based on header ID)
 */
export function sectionId(header, section) {
  let id = section.attr('id');
  if (id === undefined || id === '') {
    const headerIdStr = headerId(header);
    id = headerIdStr ? headerIdStr + '-section' : '';
    section.attr('id', id);
  }
  return id;
}

export function unhideSection(section) {
  if (section.prop('tagName') === 'SECTION') {
    const buttonEl = section.find('.collapse-button').first();
    const id = buttonEl.attr('href');
    const div = section.find(id).first();
    const path = window.location.href.replace(/#[^#]*$/i, '');
    const url = path + id;
    if (div.hasClass('collapse') && !div.hasClass('in')) {
      buttonEl.attr('aria-expanded', 'true');
      div.addClass('in');
      div.css({ height: '' });
      div.attr('aria-expanded', 'true');
      if (typeof Storage !== 'undefined') {
        window.localStorage.setItem(url, true);
        window.sessionStorage.setItem(url, true);
      }
    }
  }
}

export function unhideElement(el) {
  unhideSection(el);
  el.parents().each(function(index, value) {
    unhideSection($(this));
  });
}

/**
 * Default options
 */
export const defaults = {
  include: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
};

if ($ && $.fn) {
  $.fn.collapseDoneItems = collapseDoneItems;
  $.fn.addCollapsibility = addCollapsibility;
  $.fn.addCollapsibleElements = addCollapsibleElements;
  $.fn.addCollapsibleSections = addCollapsibleSections;
  $.fn.addCollapsibleLists = addCollapsibleLists;
  $.fn.addCollapsibleListItem = addCollapsibleListItem;
  $.fn.addCollapsibleHandlers = addCollapsibleHandlers;
  $.fn.addLinkHandlers = addLinkHandlers;
  $.fn.addCollapsibleSections.addSection = addSection;
  $.fn.addCollapsibleSections.addButton = addButton;
  $.fn.addCollapsibleSections.button = button;
  $.fn.addCollapsibleSections.headerId = headerId;
  $.fn.addCollapsibleSections.sectionId = sectionId;
  $.fn.addCollapsibleSections.defaults = defaults;
}

export default {
  unique,
  generateId,
  generateUniqueId,
  collapseDoneItems,
  addCollapsibility,
  addCollapsibleElements,
  addCollapsibleHandlers,
  addLinkHandlers,
  addCollapsibleLists,
  addCollapsibleListItem,
  addCollapsibleSections,
  addSection,
  addButton,
  button,
  headerId,
  sectionId,
  unhideSection,
  unhideElement,
  defaults
};
