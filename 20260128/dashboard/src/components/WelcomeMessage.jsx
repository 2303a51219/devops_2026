import React from 'react';

const WelcomeMessage = ({ name }) => {
  const styles = {
    container: {
      marginBottom: '2rem',
      padding: '2rem',
      background: 'linear-gradient(to right, #1e293b, #0f172a)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    heading: {
      fontSize: '2.5rem',
      background: 'var(--accent-gradient)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem',
    },
    subtext: {
      color: 'var(--text-secondary)',
      fontSize: '1.1rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Hello, {name}!</h1>
      <p style={styles.subtext}>Welcome back to your learning dashboard. Here is what's happening today.</p>
    </div>
  );
};

export default WelcomeMessage;
