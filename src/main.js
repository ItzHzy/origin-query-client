const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
require('electron-reload')(__dirname)

let win;

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        height: 1080,
        width: 1500,
        minHeight: 1080,
        minWidth: 1500
    });

    win.loadFile(path.join('index.html'))

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});

ipcMain.on("Create File", (event, filePath, data) => {
    fs.writeFileSync(filePath, data)
})