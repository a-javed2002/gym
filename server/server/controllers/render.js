import React from 'react';
import ReactDOMServer from 'react-dom/server';
import EmailTemplate from './EmailTemplate'; // Import your React component

const renderEmail = (userName) => {
  const html = ReactDOMServer.renderToStaticMarkup(<EmailTemplate userName={userName} />);
  return html;
};

// Example usage
const htmlContent = renderEmail('John Doe');
console.log(htmlContent); // This is the HTML string that you will send in the email
