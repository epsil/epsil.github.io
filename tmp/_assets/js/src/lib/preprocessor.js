import header from '../../../yml/json/header.json';
import footer from '../../../yml/json/footer.json';

// markdown-it-attrs kludge
export function escapeCurlyBraces(str) {
  // return str.replace(/^{{(.*)}}$/gm, '&#123;&#123;$1&#125;&#125;')
  return str.replace(/^{{(.*)}}$/gm, '{{$1}}\\');
}

export function fixEquations(str) {
  return str.replace(/^\$\$/gim, '$$$$ ').replace(/\$\$$/gim, ' $$$$');
}

export function makePhoneLinks(str) {
  return str.replace(/<(\+?[-\s0-9]+)>/gi, function(match, num) {
    const number = num.trim();
    const digits = number.replace(/[-\s]/gi, '');
    const link = '[' + number + '](tel:' + digits + ' "Call ' + number + '")';
    return link;
  });
}

export function preprocessor(str) {
  let result = str || '';
  // remove whitespace
  result = result.trim();
  // escape curly braces
  result = escapeCurlyBraces(result);
  // fix equations
  // result = fixEquations(result);
  // make phone links
  // result = makePhoneLinks(result);
  // add header and footer
  result = header + '\n\n' + result + '\n\n' + footer;
  return result.trim();
}

export default {
  escapeCurlyBraces,
  makePhoneLinks,
  preprocessor
};
