
# React Assignment Questions & Answers

## 1. How would you set up a new React project using tools like Create React App or Vite?

**Using Vite (Recommended for speed and modern features):**
Vite is a build tool that provides a faster and deeper development experience.
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

**Using Create React App (CRA - Traditional method):**
CRA is an officially supported way to create single-page React applications.
```bash
npx create-react-app my-app
cd my-app
npm start
```

## 2. What is the role of package.json in a React project?

The `package.json` file is the manifest for the project. Its key roles include:
*   **Dependencies Management:** Lists all library dependencies (like `react`, `react-dom`) and development dependencies (like `vite`, `eslint`) required for the project.
*   **Scripts:** Defines command-line scripts for common tasks such as starting the dev server (`start` or `dev`), building for production (`build`), and testing (`test`).
*   **Metadata:** Contains project metadata like the name, version, author, and license.
*   **Configuration:** Can contain configuration for tools like Babel, ESLint, or Browserslist (though these are often in separate files).

## 3. How do you create a functional component in React?

A functional component is simply a JavaScript function that returns JSX (HTML-like syntax).

```jsx
import React from 'react';

// Define the component
function WelcomeMessage(props) {
  return (
    <div className="welcome">
      <h1>Hello, {props.name}!</h1>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

// Export it for use in other files
export default WelcomeMessage;
```

## 4. How are components rendered inside the main App component?

Components are rendered inside the main `App` component by including them as JSX tags in the `App` component's return statement. You must first import the component.

```jsx
import WelcomeMessage from './WelcomeMessage';
import CourseDetails from './CourseDetails';

function App() {
  return (
    <div className="App">
      <WelcomeMessage name="Student" />
      <CourseDetails title="React Basics" />
    </div>
  );
}

export default App;
```

## 5. What are the benefits of breaking the UI into small reusable components?

*   **Reusability:** Write code once and use it multiple times across the application (e.g., a generic Button or Card component).
*   **Maintainability:** Smaller files are easier to understand, debug, and update. Changes in one component don't necessarily break others.
*   **Separation of Concerns:** Each component handles its own logic and styling, making the codebase more organized.
*   **Testability:** Small components are easier to unit test in isolation.
*   **Collaboration:** Different developers can work on different components simultaneously without conflict.
