import React from 'react';
import { mdInline } from '../lib/markdown';
import { hasAnchor } from '../lib/util';
import { htmlToJSX } from '../lib/util-dom';
import Link from './Link';

const Comments = props => {
  const {
    comments,
    commentsHeader,
    commentsTitle,
    local,
    path,
    references,
    referrer,
    url
  } = props;
  const commentsTitleStr = commentsTitle || 'Comments';
  const heading = (commentsHeader || 'h2').toLowerCase();
  let idx = 1;
  return (
    <React.Fragment>
      {comments && (
        <section className="comments">
          <hr className="comments-sep" />
          {htmlToJSX(
            '<' +
              heading +
              '>' +
              mdInline(commentsTitleStr) +
              '</' +
              heading +
              '>'
          )}
          <ol>
            {comments.map(commentUrl => (
              <li key={idx++}>
                <p>
                  <Link
                    referrer={referrer}
                    references={references}
                    cache={!hasAnchor(commentUrl)}
                    href={commentUrl}
                    local={local}
                    path={path}
                  />
                </p>
              </li>
            ))}
          </ol>
          {url && (
            <p>
              <Link
                referrer={referrer}
                references={references}
                cache={false}
                href={url}
                title="Permalink"
              >
                Link to the original post
              </Link>
            </p>
          )}
        </section>
      )}
    </React.Fragment>
  );
};

export default Comments;
