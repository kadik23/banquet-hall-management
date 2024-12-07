import * as clientMgr from "../models/clientsManager";

type Client = {
  id?: number;
  name: string;
  surname: string;
  phone: string;
  address :string
};

export const getClients = (page: number = 1): Client[] => {
  if (typeof page !== "number" || page < 1) {
    throw new Error("Invalid page number. It must be a positive number.");
  }
  return clientMgr.getClients(page);
};

export const createClient = (
  name: string,
  surname: string,
  phone: string,
  address :string
): { success: boolean; clientId: number } => {
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid name. It must be a non-empty string.");
  }
  if (typeof surname !== "string" || surname.trim() === "") {
    throw new Error("Invalid surname. It must be a non-empty string.");
  }
  if (typeof address !== "string" || address.trim() === "") {
    throw new Error("Invalid address. It must be a non-empty string.");
  }
  if (typeof phone !== "string" || phone.trim() === "") {
    throw new Error(
      "Invalid phone number."
    );
  }
  return clientMgr.createClient(name, surname, phone, address);
};

export const editClient = (
  id: number,
  name: string,
  surname: string,
  phone: string,
  address: string
): { success: boolean; message: string } => {
  if (typeof id !== "number" || id < 1) {
    throw new Error("Invalid ID. It must be a positive number.");
  }
  if (typeof name !== "string" || name.trim() === "") {
    throw new Error("Invalid name. It must be a non-empty string.");
  }
  if (typeof address !== "string" || address.trim() === "") {
    throw new Error("Invalid address. It must be a non-empty string.");
  }
  if (typeof surname !== "string" || surname.trim() === "") {
    throw new Error("Invalid surname. It must be a non-empty string.");
  }
  if (typeof phone !== "string") {
    throw new Error(
      "Invalid phone number"
    );
  }

  return clientMgr.editClient(id, name, surname, phone,address);
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