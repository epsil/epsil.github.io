/**
 * # Site generator
 *
 * Simple site generator implementation.
 *
 * Scans the current directory tree for `.md` files
 * and converts them to HTML.
 */

const minimist = require('minimist');
const buildOptions = require('minimist-options');

/**
 * Command line options. Passed to
 * [`minimist-options`][npm:minimist-options]
 * for parsing.
 *
 * [npm:minimist-options]: https://www.npmjs.com/package/minimist-options
 */
const cliOptions = {
  exclude: {
    alias: 'e',
    type: 'string-array',
  },
};

function main() {
  const flags = minimist(process.argv.slice(2), buildOptions(cliOptions));
  let exclude = flags['exclude'];

  // minimist does *not* explicitly support array type options.
  // If you set an option multiple times, it will indeed yield
  // an array of values. However, if you only set it once, it will
  // simply give the value as is, without wrapping it in an array.
  if (typeof exclude !== 'array') {
    exclude = [exclude];
  }

  console.log('flags: ', flags);
  console.log('exclude: ', exclude);
}

main();
