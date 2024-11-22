import React, { useEffect, useState } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import LoginForm from "./components/LoginForm";

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const App = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  // const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // Invoke the 'get-clients' IPC handler
        const data: Client[] = await window.sqlite.getClients();
        setClients(data);
      } catch (err) {
        setError(`Error: ${err}`);
      }
    };

    fetchClients();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <LoginForm />
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.surname} - {client.phone} - {client.address}
          </li>
        ))}
      </ul>
      {/* {count} */}
      {/* <button onClick={(ev) => setCount((prev) => prev + 1)}>+</button> */}
    </>
  );
};

const root = ReactDOM.createRoot(mainElement); 
root.render(<App />);