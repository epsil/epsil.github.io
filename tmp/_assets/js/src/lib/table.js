import $ from 'jquery';

export function fixTables() {
  return this.each(function() {
    // add Bootstrap classes
    $(this)
      .find('table')
      .each(function() {
        const table = $(this);

        // add Bootstrap classes
        table.addClass('table table-striped table-bordered table-hover');
        // table.wrap('<div class="table-responsive"></div>')

        // remove empty table headers
        table
          .find('thead')
          .filter(function() {
            const thead = $(this);
            return thead.find('img').length === 0 && thead.text().trim() === '';
          })
          .remove();
      });
  });
}

if ($ && $.fn) {
  $.fn.fixTables = fixTables;
}

export default {
  fixTables
};
