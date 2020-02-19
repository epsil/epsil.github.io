import $ from 'jquery';

export function fixMarks() {
  return this.each(function() {
    const body = $(this);
    body.find('mark').each(function() {
      const mark = $(this);
      mark.addClass('mark');
      if (!mark.is('[title]')) {
        mark.attr('title', 'Highlight');
      }
    });
  });
}

if ($ && $.fn) {
  $.fn.fixMarks = fixMarks;
}

export default {
  fixMarks
};
