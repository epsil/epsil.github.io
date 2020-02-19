import React from 'react';
import { Helmet } from 'react-helmet';

const LoadingScreen = props => {
  const { children, status } = props;
  return (
    <div className="text-center">
      <Helmet>
        <title>&hellip;</title>
      </Helmet>
      <h1 style={{ padding: 0 }}>
        <i className="fa fa-spinner fa-pulse fa-2x fa-fw" />
      </h1>
      {status && (
        <p style={{ color: '#555', fontFamily: 'sans-serif' }}>
          <small>
            <span className="caps">{status !== 'download' && status}</span>
          </small>
        </p>
      )}
      {children && <p>{children}</p>}
    </div>
  );
};

export default LoadingScreen;
