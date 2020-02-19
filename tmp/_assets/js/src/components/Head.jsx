import React from 'react';
import { Helmet } from 'react-helmet';
import { mdToText } from '../lib/markdown';
import { dateFormat, urlRelative, urlResolve } from '../lib/util';

const Head = props => {
  const {
    title,
    date,
    author,
    description,
    keywords,
    lang,
    icon,
    image,
    imageAlt,
    imageHeight,
    imageWidth,
    coverImage,
    coverImageAlt,
    coverImageHeight,
    coverImageWidth,
    css,
    stylesheet,
    stylesheets,
    js,
    script,
    scripts,
    video,
    mathjax,
    url,
    path,
    file,
    md5,
    referrer,
    noindex,
    siteName
  } = props;
  let idx = 1;
  return (
    <Helmet>
      <html prefix="og: http://ogp.me/ns#" lang={lang || 'en'} />
      <title>{mdToText(title)}</title>
      <meta content="text/html; charset=utf-8" httpEquiv="Content-Type" />
      {referrer ? (
        <meta content={referrer} name="referrer" />
      ) : (
        <meta content="no-referrer" name="referrer" />
      )}
      {noindex && <meta content="noindex" name="robots" />}
      {author && <meta content={mdToText(author)} name="author" />}
      {date && <meta content={dateFormat(date)} name="date" />}
      {description && (
        <meta content={mdToText(description)} name="description" />
      )}
      {keywords && <meta content={mdToText(keywords)} name="keywords" />}
      {md5 && <meta content={md5} name="md5" />}
      <meta content="text/css" httpEquiv="Content-Style-Type" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      {title && <meta content={mdToText(title)} name="DC.Title" />}
      {author && <meta content={mdToText(author)} name="DC.Creator" />}
      {date && <meta content={dateFormat(date)} name="DC.Date" />}
      {description && (
        <meta content={mdToText(description)} name="DC.Description" />
      )}
      {lang && <meta content={lang} name="DC.Language" />}
      <meta name="DC.Format" content="text/html" />
      {title && <meta content={mdToText(title)} name="og:title" />}
      {description && (
        <meta content={mdToText(description)} name="og:description" />
      )}
      {lang && <meta content={lang} name="og:locale" />}
      <meta property="og:type" content="article" />
      {url && <meta content={url} name="og:url" />}
      {siteName && <meta content={siteName} name="og:site_name" />}
      {image ? (
        <meta content={urlResolve(path, image)} name="og:image" />
      ) : (
        coverImage && (
          <meta content={urlResolve(path, coverImage)} name="og:image" />
        )
      )}
      {video && <meta content={video} name="og:video" />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@github" />
      {title && <meta content={mdToText(title)} name="twitter:title" />}
      {description && (
        <meta content={mdToText(description)} name="twitter:description" />
      )}
      {image ? (
        <meta content={urlResolve(path, image)} name="twitter:image" />
      ) : (
        coverImage && (
          <meta content={urlResolve(path, coverImage)} name="twitter:image" />
        )
      )}
      {icon && [
        <link
          href={urlRelative(path, icon)}
          key={idx++}
          rel="icon"
          type="image/x-icon"
        />,
        <link
          href={urlRelative(path, icon)}
          key={idx++}
          rel="apple-touch-icon"
        />
      ]}
      {icon
        ? [
            <link
              href={urlRelative(path, icon)}
              key={idx++}
              rel="icon"
              type="image/x-icon"
            />,
            <link
              href={urlRelative(path, icon)}
              key={idx++}
              rel="apple-touch-icon"
            />
          ]
        : path && [
            <link
              href={urlRelative(path, coverImage || '/favicon.ico')}
              key={idx++}
              rel="icon"
              type="image/x-icon"
            />,
            ...(image
              ? [
                  <link
                    href={urlRelative(path, image)}
                    key={idx++}
                    rel="apple-touch-icon"
                  />
                ]
              : coverImage
              ? [
                  <link
                    href={urlRelative(path, coverImage)}
                    key={idx++}
                    rel="apple-touch-icon"
                  />
                ]
              : [
                  <link
                    href={urlRelative(path, '/apple-touch-icon.png')}
                    key={idx++}
                    rel="apple-touch-icon"
                  />
                ])
          ]}
      <link
        href={urlRelative(path, '/_assets/css/wiki.css')}
        rel="stylesheet"
      />
      {/* <link href={url} rel="canonical" /> */}
      <link href={file} rel="alternate" title="Markdown" type="text/markdown" />
      {css &&
        css.map(x => (
          <link
            href={urlRelative(path, x)}
            key={idx++}
            rel="stylesheet"
            type="text/css"
          />
        ))}
      {stylesheet &&
        stylesheet.map(x => (
          <link
            href={urlRelative(path, x)}
            key={idx++}
            rel="stylesheet"
            type="text/css"
          />
        ))}
      {stylesheets &&
        stylesheets.map(x => (
          <link
            href={urlRelative(path, x)}
            key={idx++}
            rel="stylesheet"
            type="text/css"
          />
        ))}
      {js &&
        js.map(x => (
          <script
            key={idx++}
            src={urlRelative(path, x)}
            type="text/javascript"
          />
        ))}
      {script &&
        script.map(x => (
          <script
            key={idx++}
            src={urlRelative(path, x)}
            type="text/javascript"
          />
        ))}
      {scripts &&
        scripts.map(x => (
          <script
            key={idx++}
            src={urlRelative(path, x)}
            type="text/javascript"
          />
        ))}
      {mathjax && [
        <script type="text/x-mathjax-config">
          {`MathJax.Hub.Config({
  'HTML-CSS': {
    preferredFont: 'STIX'
  },
  TeX: {
    equationNumbers: {
      autoNumber: 'all'
    }
  }
})
`}
        </script>,
        <script
          async
          src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"
          type="text/javascript"
        />
      ]}
      {/* <script src={urlRelative(path, '/_assets/js/wiki.js')} /> */}
    </Helmet>
  );
};

export default Head;
