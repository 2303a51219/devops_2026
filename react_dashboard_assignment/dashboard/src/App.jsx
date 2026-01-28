import React from 'react';
import WelcomeMessage from './components/WelcomeMessage';
import CourseDetails from './components/CourseDetails';

function App() {
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  };

  return (
    <div className="App">
      <div style={containerStyle}>
        <WelcomeMessage name="Student" />
        <CourseDetails />
      </div>
    </div>
  );
}

export default App;
