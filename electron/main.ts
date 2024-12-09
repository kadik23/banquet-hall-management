import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createReceipt } from "./models/receiptsManager";
import fs from "fs";
let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  // mainWindow.setMenu(null);

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:8080");
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, "../dist/renderer/index.html#/")}`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on(
  "uploadPDF",
  (event, pdfData, client_id, reservation_id, paiment_id) => {
    const uploadsDir = path.join(app.getPath("userData"), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }
    try {
      const fileName = `receipt_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, Buffer.from(pdfData, "base64"));

      const response = createReceipt(
        client_id,
        reservation_id,
        paiment_id,
        filePath
      );

      event.reply("uploadPDFResponse", response);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      event.reply("uploadPDFResponse", {
        success: false,
        message: "Failed to upload PDF",
      });
    }
  }
);
