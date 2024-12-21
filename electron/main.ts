import { app, BrowserWindow, ipcMain, shell, } from "electron";
import path from "path";
import { createReceipt, deleteAllReceipts, deleteReceipt } from "./models/receiptsManager";
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
    mainWindow.loadURL(`file://${path.join(__dirname, "../dist/renderer/index.html#")}`);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  ipcMain.on('focus-fix', () => {
    mainWindow?.blur();
    mainWindow?.focus();
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

ipcMain.handle(
  "uploadPDF",
  async (_event, pdfData, client_id, reservation_id, paiment_id) => {
    const uploadsDir = path.join(app.getPath("userData"), "uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    try {
      const fileName = `receipt_${Date.now()}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      // Write PDF file from base64 data
      fs.writeFileSync(filePath, Buffer.from(pdfData, "base64"));

      // Create the receipt and return the response
      const response = await createReceipt(
        client_id,
        reservation_id,
        paiment_id,
        filePath 
      ); 
      console.log(filePath)
      return { success: true, response };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { success: false, message: "Failed to upload PDF" };
    }
  }
);

ipcMain.handle("openPDF", async (_event, pdfPath: string) => {
  try {
    const result = await shell.openPath(pdfPath); 
    if (result) {
      console.error("Error opening PDF:", result);
      return { success: false, message: result }; 
    }
    return { success: true };
  } catch (error) {
    console.error("Error opening PDF:", error);
    return { success: false, message: "Failed to open PDF" };
  }
});

ipcMain.handle("deleteFile", async (_event, filePath: string, id:number) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
      const response = await deleteReceipt(id); 
      return { success: true, message: "File deleted successfully", response };
    } else {
      return { success: false, message: "File does not exist" };
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, message: "Failed to delete file" };
  }
});

ipcMain.handle("deleteAllFilesInFolder", async (_event, folderPath: string) => {
  try {
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        if (fs.lstatSync(filePath).isFile()) {
          fs.unlinkSync(filePath); 
        }
      }
      const response = await deleteAllReceipts(); 
      return { success: true, message: "All files deleted successfully", response};
    } else {
      return { success: false, message: "Folder does not exist" };
    }
  } catch (error) {
    console.error("Error deleting files:", error);
    return { success: false, message: "Failed to delete files" };
  }
});
