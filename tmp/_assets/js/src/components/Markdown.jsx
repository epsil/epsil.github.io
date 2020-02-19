import React from 'react';
import { markdown, mdInline } from '../lib/markdown';
import HTMLFragment from './Html';

const Markdown = props => {
  const { children, inline, options } = props;
  if (inline) {
    return (
      <HTMLFragment options={options}>
        {mdInline(children, options)}
      </HTMLFragment>
    );
  }
  return (
    <HTMLFragment options={options}>{markdown(children, options)}</HTMLFragment>
  );
};

export default Markdown;
