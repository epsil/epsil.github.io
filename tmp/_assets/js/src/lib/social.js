import $ from 'jquery';
import URI from 'urijs';
import settings from '../../../yml/json/settings.json';

export function bitbucket() {
  return bitbucket.url(window.location.href);
}

bitbucket.url = function(url) {
  let urlStr = url;
  if (URI(urlStr).protocol() === 'file') {
    return urlStr;
  }
  urlStr = urlStr.replace(/#[^#]*$/, '');
  urlStr = urlStr.replace(/index\.html?$/i, '');
  const repo = settings['bitbucket-repo'] || '';
  const bitbucketStr = 'https://bitbucket.org/' + repo + '/src/HEAD';
  return bitbucketStr + urlStr + settings.index;
};

bitbucket.resource = function(url) {
  return URI(url).resource();
};

bitbucket.path = function(url) {
  return URI(bitbucket.resource(url))
    .relativeTo('/')
    .toString()
    .replace(/#[^/]*$/, '')
    .replace(/index\.html?$/, '')
    .replace(/\/?$/, '');
};

bitbucket.history = function() {
  return bitbucket.history.url(window.location.href);
};

bitbucket.history.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }
  const repo = settings['bitbucket-repo'] || '';
  const bitbucketStr = 'https://bitbucket.org/' + repo + '/history-node/HEAD';
  return bitbucketStr + url + settings.index;
};

export function github() {
  return github.url(window.location.href);
}

github.history = function() {
  return github.history.url(window.location.href);
};

github.history.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const githubStr = 'https://github.com/' + repo + '/commits/master';
  const path = github.path(url);

  return githubStr + path + '/' + settings.index;
};

github.edit = function() {
  return github.edit.url(window.location.href);
};

github.edit.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const githubStr = 'https://github.com/' + repo + '/edit/master';
  const path = github.path(url);

  return githubStr + path + '/' + settings.index;
};

github.raw = function() {
  return github.raw.url(window.location.href);
};

github.raw.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const githubStr = 'https://github.com/' + repo + '/raw/master';
  const path = github.path(url);

  return githubStr + path + '/' + settings.index;
};

github.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const githubStr = 'https://github.com/' + repo + '/blob/master';
  const path = github.path(url);

  return githubStr + path + '/' + settings.index;
};

github.resource = function(url) {
  return URI(url).resource();
};

github.path = function(url) {
  let urlStr = URI(github.resource(url));
  if (urlStr.is('absolute')) {
    urlStr = urlStr.relativeTo('/');
  }
  urlStr = urlStr
    .toString()
    .replace(/index\.html?$/, '')
    .replace(/\/?$/, '');
  return urlStr;
};

export function mail() {
  return mail.url(window.location.href);
}

mail.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'mailto:?body=' + urlStr;
};

export function facebook() {
  return facebook.url(window.location.href);
}

facebook.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'http://www.facebook.com/share.php?u=' + urlStr;
};

export function linkedin() {
  return linkedin.url(window.location.href);
}

linkedin.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'http://www.linkedin.com/shareArticle?url=' + urlStr;
};

export function twitter() {
  return twitter.url(window.location.href);
}

twitter.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'https://twitter.com/intent/tweet?url=' + urlStr;
};

if ($ && $.fn) {
  $.fn.bitbucket = bitbucket;
  $.fn.github = github;
  $.fn.mail = mail;
  $.fn.facebook = facebook;
  $.fn.linkedin = linkedin;
  $.fn.twitter = twitter;
}

export default {
  bitbucket,
  github,
  mail,
  facebook,
  linkedin,
  twitter
};
