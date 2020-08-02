const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev');

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

    isDev ? win.loadURL('http://localhost:3000/') : win.loadURL(path.join(__dirname, '../build/index.html'))

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

app.on('windows-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});