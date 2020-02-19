import React from 'react';
import { dateFormat, urlRelative } from '../lib/util';
import Markdown from './Markdown';

const Header = props => {
  const {
    children,
    title,
    subtitle,
    date,
    author,
    authorUrl,
    authorEmail,
    description,
    includeBefore,
    image,
    imageAlt,
    imageHeight,
    imageWidth,
    coverImage,
    coverImageAlt,
    coverImageHeight,
    coverImageWidth,
    coverImageTitle,
    url,
    path,
    footnotesHeader,
    showTitle,
    showHeader
  } = props;
  return (
    <header style={showHeader ? {} : { display: 'none' }}>
      {includeBefore && <Markdown inline>{includeBefore}</Markdown>}
      {title && showTitle ? (
        <React.Fragment>
          <h1 className="p-name">
            <a className="u-uid u-url" href={url} rel="bookmark" title={path}>
              <Markdown inline>{title}</Markdown>
            </a>
          </h1>
          {subtitle && (
            <h2>
              <Markdown inline>{subtitle}</Markdown>
            </h2>
          )}
          {author ? (
            author.name ? (
              <p className="author">
                {author.url ? (
                  <a className="p-author h-card" href={author.url}>
                    <Markdown inline>{author.name}</Markdown>
                  </a>
                ) : (
                  <span className="p-author">
                    <Markdown inline>{author.name}</Markdown>
                  </span>
                )}
                {author && date && (
                  <React.Fragment>
                    {' '}
                    <span>&bull;</span>{' '}
                  </React.Fragment>
                )}
                {date && (
                  <time className="dt-published" dateTime={dateFormat(date)}>
                    {dateFormat(date)}
                  </time>
                )}
              </p>
            ) : (
              <p className="author">
                {authorUrl ? (
                  <a className="p-author h-card" href={authorUrl}>
                    <Markdown inline>{author}</Markdown>
                  </a>
                ) : authorEmail ? (
                  <a className="p-author h-card" href={'mailto:' + authorEmail}>
                    <Markdown inline>{author}</Markdown>
                  </a>
                ) : (
                  <span className="p-author">
                    <Markdown inline>{author}</Markdown>
                  </span>
                )}
                {author && date && (
                  <React.Fragment>
                    {' '}
                    <span>&bull;</span>{' '}
                  </React.Fragment>
                )}
                {date && (
                  <time className="dt-published" dateTime={dateFormat(date)}>
                    {dateFormat(date)}
                  </time>
                )}
              </p>
            )
          ) : (
            date && (
              <p>
                <time className="dt-published" dateTime={dateFormat(date)}>
                  {dateFormat(date)}
                </time>
              </p>
            )
          )}
        </React.Fragment>
      ) : (
        date && (
          <h1 className="p-name">
            <a className="u-uid u-url" href={url} title="Permalink">
              <Markdown inline>{date}</Markdown>
            </a>
          </h1>
        )
      )}
      {description && (
        <p className="p-summary">
          <Markdown inline>{description}</Markdown>
        </p>
      )}
      {image ? (
        <figure>
          <a className="image" href={urlRelative(path, image)}>
            <img
              alt={imageAlt}
              className="u-photo"
              {...(imageHeight ? { height: imageHeight } : {})}
              {...(imageWidth ? { width: imageWidth } : {})}
              src={urlRelative(path, image)}
            />
          </a>
        </figure>
      ) : (
        coverImage && (
          <figure>
            <a className="image" href={urlRelative(path, coverImage)}>
              <img
                alt={coverImageAlt}
                className="u-photo"
                {...(coverImageHeight ? { height: coverImageHeight } : {})}
                {...(coverImageWidth ? { width: coverImageWidth } : {})}
                {...(coverImageTitle ? { title: coverImageTitle } : {})}
                src={urlRelative(path, coverImage)}
              />
            </a>
          </figure>
        )
      )}
      {children}
    </header>
  );
};

export default Header;
