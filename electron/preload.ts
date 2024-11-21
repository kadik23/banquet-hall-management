const { contextBridge } = require("electron")
const clientMgr = require("./models/clientsManager")

const getClients = () => {
  return clientMgr.getClient();
}
contextBridge.exposeInMainWorld("sqlite", {
  getClients,
})