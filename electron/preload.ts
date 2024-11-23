const { contextBridge } = require("electron");
const {
  getClients,
  createClient,
  editClient,
  deleteClient,
  deleteAllClients,
} = require("./controllers/clientsController");

contextBridge.exposeInMainWorld("sqliteClients", {
  getClients: (page: number) => getClients(page),
  createClient: (name: string, email: string, phone: string) =>
    createClient(name, email, phone),
  editClient: (id: number, name: string, email: string, phone: string) =>
    editClient(id, name, email, phone),
  deleteClient: (id: number) => deleteClient(id),
  deleteAllClients: () => deleteAllClients(),
});
