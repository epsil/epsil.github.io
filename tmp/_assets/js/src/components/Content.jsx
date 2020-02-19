import React from 'react';
import Notes from './Notes';
import Tags from './Tags';
import Comments from './Comments';
import Markdown from './Markdown';
import HTMLFragment from './Html';

const Content = props => {
  const {
    includeAfter,
    indent,
    italicQuotes,
    sidenotes,
    footnotes,
    footnotesHeader,
    footnotesTitle,
    comments,
    commentsHeader,
    commentsTitle,
    local,
    path,
    url,
    references,
    referrer,
    tags,
    categories,
    children
  } = props;
  return (
    <section
      className={
        'e-content' +
        (indent ? ' indent' : '') +
        (italicQuotes ? ' italic-quotes' : '') +
        (sidenotes ? ' sidenotes' : '')
      }
    >
      {children}
      {includeAfter && <Markdown>{includeAfter}</Markdown>}
      {footnotes && (
        <Notes {...props}>
          <HTMLFragment>{footnotes}</HTMLFragment>
        </Notes>
      )}
      {comments && <Comments {...props} />}
      {tags && <Tags {...props} />}
    </section>
  );
};

export default Content;
