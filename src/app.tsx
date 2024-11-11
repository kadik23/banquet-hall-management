import React, { useState } from "react";
import ReactDom from "react-dom";
import Home from "./components/Home";
import './index.css';

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const App = () => {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-500">Hi from a react app</h1>
      <Home />
      {count}
      <button onClick={(ev) => setCount((prev) => prev + 1)}>+</button>
    </>
  );
};

ReactDom.render(<App />, mainElement);
