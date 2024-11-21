import { app, BrowserWindow, ipcMain } from "electron";
let mainWindow: Electron.BrowserWindow | null;
// import {db} from './models/dbManger'
const path = require('path')
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8080");
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ipcMain.handle('get-clients', async () => {
//   return new Promise((resolve, reject) => {
//       db.all('SELECT * FROM clients', [], (err:Error, rows:any) => {
//           if (err) {
//               reject(err.message);
//           } else {
//               resolve(rows);
//           }
//       });
//   });
// });

app.on("ready", createWindow);
app.allowRendererProcessReuse = true;
