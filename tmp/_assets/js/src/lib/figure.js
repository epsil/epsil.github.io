import $ from 'jquery';

export function fixFigures() {
  return this.each(function() {
    $(this)
      .find('figure > img')
      .each(setClassesOnContainer);
    $(this)
      .find('p img')
      .each(createFigures);
    $(this)
      .find('a > img')
      .each(addImageLinkClass);
  });
}

export function setClassesOnContainer() {
  const img = $(this);
  const fig = findImageFigure(img);
  moveAttributes(img, fig);
  addLink(img);
}

export function createFigures() {
  const img = $(this);
  if (hasCaption(img)) {
    createCaptionedFigure(img);
  } else {
    createUncaptionedFigure(img);
  }
}

export function addImageLinkClass() {
  const img = $(this);
  const a = img.parent();
  a.addClass('image');
}

// replace <p><img></p> with <figure><img></figure>
export function createUncaptionedFigure(img) {
  const p = findImageParagraph(img);
  const isSingleImage = p.find('img').length === 1;
  if (isEmptyParagraph(p) && isSingleImage) {
    const fig = $('<figure>');
    fig.insertBefore(p);
    fig.html(p.html());
    const imgEl = fig.find('img');
    p.remove();
    if (imgEl.length === 1) {
      moveAttr('class', imgEl, fig);
    }
    addLink(imgEl);
  }
}

// create <figure> with <figcaption>
export function createCaptionedFigure(img) {
  const p = findImageParagraph(img);
  const alt = img.attr('alt');
  const fig = $('<figure></figure>');
  const caption = $('<figcaption>' + alt + '</figcaption>');
  fig.append(img);
  fig.append(caption);
  moveAttributes(img, fig);
  addLink(img);
  // insert into DOM
  fig.insertBefore(p);
  if (isEmptyParagraph(p)) {
    p.remove();
  }
}

export function fileName(url) {
  const segments = url.trim().split('/');
  const last = segments[segments.length - 1];
  return last;
}

export function moveAttributes(img, fig) {
  moveAttr('class', img, fig);
  moveAttr('id', img, fig);
  moveWidth(img, fig);
}

export function moveAttr(attr, from, to) {
  if (from.is('[' + attr + ']')) {
    to.attr(attr, from.attr(attr));
    from.removeAttr(attr);
  }
}

export function moveWidth(img, fig) {
  if (img.is('[width]')) {
    const width = parseInt(img.attr('width'), 10);
    fig.css('width', width + 9 + 'px');
  }
}

export function addLink(img) {
  const hasLink = img.parents('a').length > 0;
  if (!hasLink) {
    img.wrap(
      '<a href="' +
        img.attr('src') +
        '" title="View ' +
        fileName(img.attr('src')) +
        ' in full screen"></a>'
    );
  }
}

export function findImageParagraph(img) {
  return findParent(img, 'p');
}

export function findImageFigure(img) {
  return findParent(img, 'figure');
}

export function findParent(el, name) {
  const tagName = name.toUpperCase();
  let parent = el.parent();
  while (parent.prop('tagName') !== tagName) {
    parent = parent.parent();
  }
  return parent;
}

export function hasCaption(img) {
  const alt = img.attr('alt') || '';
  return alt.trim() !== '';
}

export function isEmptyParagraph(p) {
  return p.text().trim() === '';
}

if ($ && $.fn) {
  $.fn.fixFigures = fixFigures;
}

export default {
  fixFigures,
  setClassesOnContainer,
  createFigures,
  addImageLinkClass,
  createUncaptionedFigure,
  createCaptionedFigure,
  fileName,
  moveAttributes,
  moveAttr,
  moveWidth,
  addLink,
  findImageParagraph,
  findImageFigure,
  findParent,
  hasCaption,
  isEmptyParagraph
};
