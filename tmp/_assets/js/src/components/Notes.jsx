import React from 'react';
import { mdInline } from '../lib/markdown';
import { htmlToJSX } from '../lib/util-dom';

const Notes = props => {
  const { children, footnotesHeader, footnotesTitle } = props;
  const heading = (footnotesHeader || 'h2').toLowerCase();
  return (
    <React.Fragment>
      {children &&
        (footnotesTitle ? (
          <section className="footnotes">
            {htmlToJSX(
              '<' +
                heading +
                '>' +
                mdInline(footnotesTitle) +
                '</' +
                heading +
                '>'
            )}
            {children}
          </section>
        ) : (
          <section className="footnotes">
            <hr className="footnotes-sep endnotes" />
            {children}
          </section>
        ))}
    </React.Fragment>
  );
};

export default Notes;
