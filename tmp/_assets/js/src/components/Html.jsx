import React from 'react';
import { htmlToJSXFragment } from '../lib/util-dom';

const HTMLFragment = props => {
  const { children, options } = props;
  return (
    <React.Fragment>{htmlToJSXFragment(children, options)}</React.Fragment>
  );
};

export default HTMLFragment;
