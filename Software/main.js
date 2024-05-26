const {app,BrowserWindow}  = require('electron')

var mainWindow = null;
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: 1200, 
        height: 800,
        autoHideMenuBar:true
    });
    mainWindow.loadURL('https://buymarket.cyclic.app/');
    mainWindow.on('closed', function() {
        mainWindow = null;
    })
});