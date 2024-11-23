const clientMgr = require("../models/clientsManager");

export const getClients = (page = 1) => {
  return clientMgr.getClients(page);
};

export const createClient = (name: string, email: string, phone: string) => {
  return clientMgr.createClient(name, email, phone);
};

export const editClient = (
  id: number,
  name: string,
  email: string,
  phone: string
) => {
  return clientMgr.editClient(id, name, email, phone);
};

export const deleteClient = (id: string) => {
  return clientMgr.deleteClient(id);
};

export const deleteAllClients = () => {
  return clientMgr.deleteAllClients();
};
