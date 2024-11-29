import React, { useEffect, useState } from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import LoginForm from "./components/LoginForm";

const mainElement = document.createElement("div");
document.body.appendChild(mainElement);

const App = () => {
  // const [clients, setClients] = useState<Client[]>([]);
  // const [clientsNbr, setClientsNbr] = useState<number>(0);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchClients = async () => {
  //     try {
  //       // Invoke the 'get-clients' IPC handler
  //       const data: Client[] = await window.sqliteClients.getClients(1);
  //       const nbrCl: number = await window.sqliteStatistics.getNumClients();
  //       setClients(data);
  //       setClientsNbr(nbrCl);
  //     } catch (err) {
  //       setError(`Error: ${err}`);
  //     }
  //   };

  //   fetchClients();
  // }, []);

  // const DeleteAll =async () => {
  //   try {
  //     const data = await window.sqliteClients.deleteAllClients();
  //     if(data.success){
  //       setClientsNbr(0);
  //       setClients([])
  //     }
  //   } catch (err) {
  //     setError(`Error: ${err}`);
  //   }
  // };

  // if (error) {
  //   return <div>{error}</div>;
  // }

  return (
    <>
      <LoginForm />
      {/* <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.surname} - {client.phone} - {client.address}
          </li>
        ))}
      </ul>{" "}
      <br />
      <p>
        Number of Clients: <b>{clientsNbr}</b>
      </p> <br />
      <button onClick={DeleteAll} className="border-2 p-1 m-2 rounded-md">Delete All Client</button> */}
    </>
  );
};

const root = ReactDOM.createRoot(mainElement);
root.render(<App />);