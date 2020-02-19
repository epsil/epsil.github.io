import React from 'react';
import { getCachedUrl, isExternalUrl, urlRelative } from '../lib/util';

const Link = props => {
  const {
    cache,
    children,
    local,
    path,
    references,
    referrer,
    title,
    href
  } = props;
  let url = !path || cache === false ? href : getCachedUrl(href, references);
  if (path) {
    url = urlRelative(path, url, local);
  }
  const external = isExternalUrl(url);
  const isUrl =
    !children || (typeof children === 'string' && children.match(/^https?:/i));
  return (
    <a
      className={isUrl ? 'url' : ''}
      href={url}
      rel={
        external
          ? 'nofollow noopener' +
            (referrer === 'no-referrer' ? ' noreferrer' : '')
          : ''
      }
      target={external ? '_blank' : ''}
      title={title}
    >
      {children || href}
    </a>
  );
};

export default Link;
