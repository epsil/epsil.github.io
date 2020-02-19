import React from 'react';
import Link from './Link';

function tagLink(tag) {
  return `/tag/${tag}/`;
}

const Tags = props => {
  const { tags, categories, path, local } = props;
  let idx = 1;
  return (
    <React.Fragment>
      {tags && (
        <section className="tags">
          <p>
            <strong>Tags</strong>
          </p>
          <ul className="list-inline text-center">
            {tags.map(tag => (
              <li key={idx++}>
                <Link href={tagLink(tag)} local={local} path={path}>
                  {tag}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </React.Fragment>
  );
};

export default Tags;
