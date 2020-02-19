import React, { Component } from 'react';
import $ from 'jquery';
import Headroom from 'react-headroom';
import { mdToText } from '../lib/markdown';
import { searchHandler } from '../lib/reference';
import { urlRelative } from '../lib/util';
import Markdown from './Markdown';
import HTMLFragment from './Html';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.addClickHandlers = this.addClickHandlers.bind(this);
  }

  componentDidMount() {
    this.addClickHandlers();
  }

  addClickHandlers() {
    // close table of contents
    $('#toc a[href]').each(function() {
      const link = $(this);
      link.click(function(event) {
        const button = $('#toc-button');
        button.click();
      });
    });
    const { references } = this.props;
    $('nav form').on('submit', searchHandler(references));
  }

  render() {
    const {
      showNav,
      path,
      file,
      local,
      nav,
      toc,
      tocTitle,
      homeTitle,
      searchTitle,
      facebook,
      facebookTitle,
      twitter,
      twitterTitle,
      linkedin,
      linkedinTitle,
      clipboardTitle,
      github,
      githubRepo,
      githubRepoTitle,
      githubEdit,
      githubEditTitle,
      githubHistory,
      githubHistoryTitle,
      markdownTitle,
      bitbucket,
      bitbucketRepo,
      bitbucketRepoTitle,
      bitbucketHistory,
      bitbucketHistoryTitle
    } = this.props;
    let idx = 1;
    return (
      <Headroom disableInlineStyles style={showNav ? {} : { display: 'none' }}>
        <nav className="navbar navbar-default">
          <div className="container-fluid topbar">
            <ul className="nav nav-pills navbar-left">
              <li role="presentation">
                <a href={urlRelative(path, '/q/', local)} title="Ask Q">
                  Q
                </a>
              </li>
              <li role="presentation">
                <a href={urlRelative(path, '/', local)} title="Wiki">
                  W
                </a>
              </li>
              <li role="presentation">
                <a href={urlRelative(path, '/z/', local)} title="Zettelkasten">
                  Z
                </a>
              </li>
              <li role="presentation">
                <a href={urlRelative(path, '/todo/', local)} title="To do">
                  G
                </a>
              </li>
              <li role="presentation">
                <a
                  href={urlRelative(path, '/z/r/0b-news/', local)}
                  title="News"
                >
                  N
                </a>
              </li>
            </ul>
            <ul className="nav nav-pills navbar-right">
              {nav &&
                nav.map(x => (
                  <li key={idx++}>
                    <Markdown inline>{x}</Markdown>
                  </li>
                ))}
              {/* <li role="presentation"><a href={facebook} target="_blank" title={mdToText(facebookTitle)}><i className="fa fa-facebook-square"></i></li> */}
              {/* <li role="presentation"><a href={twitter} target="_blank" title={mdToText(twitterTitle)}><i className="fa fa-twitter-square"></i></li> */}
              {/* <li role="presentation"><a href={linkedin} target="_blank" title={mdToText(linkedinTitle)}><i className="fa fa-linkedin-square"></i></li> */}
              {/* <li role="presentation"><a href={linkedin} target="_blank" title={mdToText(linkedinTitle)}><i className="fa fa-linkedin-square"></i></li> */}
              <li role="presentation">
                <a
                  href={urlRelative(path, '/tmp/clipboard/', local)}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={mdToText(clipboardTitle)}
                >
                  <span className="clipboard-logo" />
                </a>
              </li>
              {githubRepo ? (
                <React.Fragment>
                  {/* <li role="presentation"> <a href={github} title={mdToText(githubRepoTitle)} > <i className="fa fa-github" /> </a> </li> */}
                  <li role="presentation">
                    <a href={githubEdit} title={mdToText(githubEditTitle)}>
                      <i className="fa fa-edit" />
                    </a>
                  </li>
                  {/* <li role="presentation"><a href={githubHistory} title={mdToText(githubHistoryTitle)}><i className="fa fa-history"></i></a></li> */}
                  <li role="presentation">
                    <a
                      href={file}
                      title={mdToText(markdownTitle)}
                      type="text/plain"
                    >
                      <span className="markdown-mark" />
                    </a>
                  </li>
                </React.Fragment>
              ) : bitbucketRepo ? (
                <React.Fragment>
                  <li role="presentation">
                    <a href={bitbucket} title={mdToText(bitbucketRepoTitle)}>
                      <i className="fa fa-edit" />
                    </a>
                  </li>
                  {/* <li role="presentation"><a href={bitbucketHistory} title={mdToText(bitbucketHistoryTitle)}><i className="fa fa-history"></i></a></li> */}
                  <li role="presentation">
                    <a
                      href={file}
                      title={mdToText(markdownTitle)}
                      type="text/plain"
                    >
                      <span className="markdown-mark" />
                    </a>
                  </li>
                </React.Fragment>
              ) : (
                <li role="presentation">
                  <a
                    href={file}
                    title={mdToText(markdownTitle)}
                    type="text/plain"
                  >
                    <span className="markdown-mark" />
                  </a>
                </li>
              )}
              {toc && (
                <li role="presentation">
                  <a
                    id="toc-button"
                    href="#toc"
                    data-toggle="collapse"
                    title={mdToText(tocTitle)}
                  >
                    <i className="fa fa-list" />
                  </a>
                </li>
              )}
            </ul>
            <form
              action="https://www.google.com/search"
              className="navbar-form"
              method="get"
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="form-group" style={{ display: 'inline' }}>
                <div className="input-group" style={{ display: 'table' }}>
                  <span className="input-group-addon" style={{ width: '1%' }}>
                    <span className="glyphicon glyphicon-search" />
                  </span>
                  <input
                    accessKey="."
                    autoComplete="off"
                    className="form-control"
                    name="q"
                    title={mdToText(searchTitle)}
                    type="text"
                  />
                </div>
              </div>
            </form>
          </div>
          {toc && typeof toc === 'string' && <HTMLFragment>{toc}</HTMLFragment>}
        </nav>
      </Headroom>
    );
  }
}

export default Navbar;
