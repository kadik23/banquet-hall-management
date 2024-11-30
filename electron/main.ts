import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: Electron.BrowserWindow | null;

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

  // Supprimer la barre de menu
  mainWindow.setMenu(null);

  // Chargez votre application React à partir de l'URL locale
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8080"); // Utiliser le serveur de développement en mode dev
  } else {
    // En production, charger le fichier local avec le chemin file://
    mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
