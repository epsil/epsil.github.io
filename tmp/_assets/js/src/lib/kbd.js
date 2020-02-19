import $ from 'jquery';

export function addHotkeys() {
  return this.map(function() {
    const body = $(this);
    body
      .find('kbd:contains("Ctrl")')
      .replaceWith('<kbd title="Control">Ctrl</kbd>');
    body.find('kbd:contains("Alt")').replaceWith('<kbd title="Alt">Alt</kbd>');
    body
      .find('kbd:contains("Esc")')
      .replaceWith('<kbd title="Escape">Esc</kbd>');
    body
      .find('kbd:contains("Enter")')
      .replaceWith('<kbd title="Enter">\u21b5</kbd>');
    body
      .find('kbd:contains("Tab")')
      .replaceWith('<kbd title="Tab">\u21b9</kbd>');
    body
      .find('kbd:contains("Windows")')
      .replaceWith('<kbd title="Windows"><i class="fa fa-windows"></i></kbd>');
    body
      .find('kbd:contains("Shift"), kbd:contains("\u21e7")')
      .replaceWith('<kbd title="Shift">\u21e7</kbd>');
    body
      .find(
        'kbd:contains("Cmd"), kbd:contains("Command"), kbd:contains("\u2318")'
      )
      .replaceWith('<kbd title="Command">\u2318</kbd>');
    body
      .find(
        'kbd:contains("Opt"), kbd:contains("Option"), kbd:contains("\u2325")'
      )
      .replaceWith('<kbd title="Option">\u2325</kbd>');
    body
      .find('kbd:contains("Fn"), kbd:contains("Function")')
      .replaceWith('<kbd title="Function">Fn</kbd>');
    body
      .find('kbd:contains("PgUp"), kbd:contains("Page Up")')
      .replaceWith('<kbd title="Page Up">PgUp</kbd>');
    body
      .find('kbd:contains("PgDn"), kbd:contains("Page Down")')
      .replaceWith('<kbd title="Page Down">PgDn</kbd>');
    body
      .find('kbd:contains("Eject")')
      .replaceWith('<kbd title="Eject">\u23cf</kbd>');
    body
      .find('kbd:contains("Power")')
      .replaceWith('<kbd title="Power"><i class="fa fa-power-off"></i></kbd>');
    body
      .find('kbd:contains("Left")')
      .replaceWith('<kbd title="Left">\u2190</kbd>'); // \u2b05
    body
      .find('kbd:contains("Right")')
      .replaceWith('<kbd title="Right">\u2192</kbd>'); // \u27a1
    body
      .find('kbd')
      .filter(function() {
        return (
          $(this)
            .text()
            .trim() === 'Up'
        );
      })
      .replaceWith('<kbd title="Up">\u2191</kbd>'); // \u2b06
    body
      .find('kbd')
      .filter(function() {
        return (
          $(this)
            .text()
            .trim() === 'Down'
        );
      })
      .replaceWith('<kbd title="Down">\u2193</kbd>'); // \u2b07
    return body;
  });
}

if ($ && $.fn) {
  $.fn.addHotkeys = addHotkeys;
}

export default {
  addHotkeys
};
