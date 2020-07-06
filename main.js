console.log('main process working')

const electron = require("electron");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow

const path = require("path")
const url = require("url")


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
            // height: 800,
            // width: 1200,
            // minHeight: 800,
            // minWidth: 1200
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file',
        slashes: true
    }));

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