import React from 'react';

const EmailTemplate = ({ userName }) => {
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f4f4f4',
      padding: '20px',
      textAlign: 'center',
    },
    header: {
      backgroundColor: '#007bff',
      color: '#ffffff',
      padding: '10px 0',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    body: {
      backgroundColor: '#ffffff',
      margin: '20px auto',
      padding: '20px',
      borderRadius: '5px',
      maxWidth: '600px',
    },
    paragraph: {
      fontSize: '16px',
      color: '#333333',
    },
    button: {
      display: 'inline-block',
      padding: '10px 20px',
      marginTop: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#007bff',
      textDecoration: 'none',
      borderRadius: '5px',
    },
    footer: {
      marginTop: '20px',
      fontSize: '14px',
      color: '#666666',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Welcome to Our Service!</div>
      <div style={styles.body}>
        <p style={styles.paragraph}>
          Hi {userName},
        </p>
        <p style={styles.paragraph}>
          Thank you for registering with us. We're thrilled to have you on board. Click the button below to start exploring our features.
        </p>
        <a href="https://example.com/dashboard" style={styles.button}>
          Go to Dashboard
        </a>
        <p style={styles.footer}>
          If you have any questions, feel free to <a href="mailto:support@example.com">contact our support team</a>.
        </p>
      </div>
    </div>
  );
};

export default EmailTemplate;
