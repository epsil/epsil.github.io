import $ from 'jquery';
import { generateUniqueId } from './id';

export function addAnchors() {
  return this.each(function() {
    $(this)
      .find('h1, h2, h3, h4, h5, h6')
      .each(function() {
        const header = $(this);
        const clone = header.clone();
        clone.find('[aria-hidden="true"]').remove();
        const title = clone.text().trim();

        // generate ID if missing
        let id = header.attr('id');
        if (id === undefined || id === '') {
          id = generateUniqueId(header);
          header.attr('id', id);
        }

        // create anchor
        const anchorEl = $(
          '<a aria-hidden="true" class="header-anchor" href="#' +
            id +
            '" title="' +
            title +
            '"></a>'
        );

        // add anchor
        header.prepend(anchorEl);
      });
  });
}

if ($ && $.fn) {
  $.fn.addAnchors = addAnchors;
}

export default {
  addAnchors
};
