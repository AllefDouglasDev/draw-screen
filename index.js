const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const mainWindow = new BrowserWindow({
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
    transparent: true,
    frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  //mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
