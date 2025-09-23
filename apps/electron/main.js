const { app, BrowserWindow } = require("electron");

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
        nodeIntegration: true
        }
    });

    // Открываем фронтенд (Vite dev server, обычно 5173)
    win.loadURL("http://localhost:5173");

    // API NestJS будет доступен на http://localhost:3000
}

app.whenReady().then(createWindow);
