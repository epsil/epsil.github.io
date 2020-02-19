import React from 'react';
import Header from './Header';
import Content from './Content';
import HTMLFragment from './Html';

const Article = props => {
  const { content } = props;
  return (
    <article className="h-entry" id="main">
      <Header {...props} />
      <Content {...props}>
        <HTMLFragment>{content}</HTMLFragment>
      </Content>
    </article>
  );
};

export default Article;
