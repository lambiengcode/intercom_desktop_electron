const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;


app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            enableRemoteModule: true,
            preload: path.join(app.getAppPath(), 'preload.js')
        }
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, './app/main.html'),
        protocol: 'file:',
        slashes: true
    }));



    mainWindow.on('closed', function () {
        app.quit();
    })

    //build menu from template

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
]

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

//add developer tools
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}