/* global Clipboard:true, clipboard:true */
/* exported Clipboard */
/* exported clipboard */

/**
 * Clipboard buttons for pre and code elements.
 *
 * http://clipboardjs.com/
 */

import $ from 'jquery';
import Clipboard from 'clipboard';
import { getId } from './id';

let clipboard = null;

export function addClipboardButtons() {
  return this.map(function() {
    const body = $(this);
    body.find('pre, code').each(function() {
      const pre = $(this);
      const parents = pre.parents('pre');
      if (parents.length === 0) {
        const id = getId(pre);
        const button = $(
          '<button class="btn clippy" data-clipboard-target="#' +
            id +
            '" title="Copy to clipboard"><i class="fa fa-clipboard"></i></button>'
        );
        if (pre.is('code')) {
          const span = pre.wrap('<span class="code"></span>').parent();
          span.append(button);
        } else {
          const div = pre.wrap('<div class="pre"></span>').parent();
          div.prepend(button);
        }
      }
    });
    try {
      clipboard = new Clipboard('.btn', {
        text: function(trigger) {
          return this.target(trigger).innerText.trim();
        }
      });
      clipboard.on('success', function(e) {
        e.text = e.text.trim();
        e.clearSelection();
      });
    } catch (err) {
      body.find('.btn').remove();
    }
    return body;
  });
}

if ($ && $.fn) {
  $.fn.addClipboardButtons = addClipboardButtons;
}

export default {
  addClipboardButtons
};
