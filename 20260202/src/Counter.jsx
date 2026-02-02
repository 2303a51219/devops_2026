import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="glass-card">
      <h2>Counter Application</h2>
      <h1>{count}</h1>

      <div className="btn-group">
        <button className="btn-primary" onClick={increment}>Increment</button>
        <button className="btn-danger" onClick={decrement}>Decrement</button>
      </div>

      <button className="btn-reset" onClick={reset}>Reset Counter</button>
    </div>
  );
}

export default Counter;
