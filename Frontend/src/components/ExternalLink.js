/*
A link to an outside site (e.g. LMFDB). Online it opens in a new tab;
offline it renders as plain text so the label stays readable.
*/
import React from 'react';
import useOnline from '../hooks/useOnline';

export default function ExternalLink({ href, children, ...rest }) {
  const online = useOnline();

  if (!online) {
    return <span>{children}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
