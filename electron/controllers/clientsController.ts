const clientMgr = require("../models/clientsManager");

type Client = {
  id?: number;
  name: string;
  email: string;
  phone: string;
};

export const getClients = (page: number = 1): Client[] => {
  if (typeof page !== "number" || page < 1) {
    throw new Error("Invalid page number. It must be a positive number.");
  }
  return clientMgr.getClients(page);
};

export const createClient = (
  name: string,
  email: string,
  phone: string
): { success: boolean; clientId: number } => {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid name. It must be a non-empty string.");
  }
  if (typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid email. It must be a valid email address.");
  }
  if (typeof phone !== "string" || phone.trim().length < 8) {
    throw new Error(
      "Invalid phone number. It must be at least 8 characters long."
    );
  }

  return clientMgr.createClient(name, email, phone);
};

export const editClient = (
  id: number,
  name: string,
  email: string,
  phone: string
): { success: boolean; message: string } => {
  if (typeof id !== "number" || id < 1) {
    throw new Error("Invalid ID. It must be a positive number.");
  }
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid name. It must be a non-empty string.");
  }
  if (typeof email !== "string" || !email.includes("@")) {
    throw new Error("Invalid email. It must be a valid email address.");
  }
  if (typeof phone !== "string" || phone.trim().length < 8) {
    throw new Error(
      "Invalid phone number. It must be at least 8 characters long."
    );
  }

  return clientMgr.editClient(id, name, email, phone);
};

export const deleteClient = (
  id: number
): { success: boolean; message: string } => {
  if (typeof id !== "number" || id < 1) {
    throw new Error("Invalid ID. It must be a positive number.");
  }
  return clientMgr.deleteClient(id);
};

export const deleteAllClients = (): { success: boolean; message: string } => {
  return clientMgr.deleteAllClients();
};

export const searchClients = (searchItem: string, page = 1) => {
  return clientMgr.searchClients(searchItem, page);
};