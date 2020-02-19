import $ from 'jquery';

export function fixCenteredText() {
  return this.map(function() {
    return $(this)
      .find('center')
      .replaceWith(function() {
        const p = $('<p class="text-center">');
        p.html($(this).html());
        return p;
      });
  });
}

if ($ && $.fn) {
  $.fn.fixCenteredText = fixCenteredText;
}

export default {
  fixCenteredText
};
