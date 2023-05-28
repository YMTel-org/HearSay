// This is the main process. Here is where can spawn BrowserWindows, etc.

// Module to control the application lifecycle and the native browser window.
const { spawn, exec } = require("child_process");
const { app, shell, BrowserWindow, protocol, ipcMain } = require("electron");
const { createURLRoute } = require("electron-router-dom");
const path = require("path");
const url = require("url");
const fs = require('fs');
const mkfifo = require("mkfifo");


// Create the native browser window.
function createWindow(id, options) {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true
    },
    ...options
    // Set the path of an additional "preload" script that can be used to
    // communicate between node-land and browser-land.
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  window.loadURL(createURLRoute(appURL, id));

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    window.webContents.openDevTools();
  }

  window.webContents.on("new-window", function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {  
  // Set global window variable to be the MAIN screen
  createWindow('main', {
      title: "Controls",
      // uncomment when done with development
      // frame: false
  });

  let whisperProcess = createWhisperProcess();
  console.log(whisperProcess)

  ipcMain.on("send-audio-data", (event, data) => {
    console.log("sending audio to whisper", data)
    // send data to whisper process
    whisperProcess.stdout.pipe(process.stdout);
    whisperProcess.stdin.write(data);
    // Send a message to the child process to stop the while loop
    const message = 'stop';
    fs.appendFileSync('electron', message);
    whisperProcess.stdin.end();
  })

  createWindow('subtitles', {
    width: 450,
    height: 350,
    title: "Subtitles",
    // uncomment when done with development
    // frame: false
  })
  createWindow('settings', {
    width: 450,
    height: 350,
    title: "Settings"
  })
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// TODO: Can add some parameters for this function to allow configurations
const createWhisperProcess = () => {
  const command = './public/whisper/command';
  const args = ['-m', './public/whisper/models/ggml-base.bin', '-t', '8', '-c', '0'];
  const whisperProcess = spawn(command, args);
  // on sending data to child process
  whisperProcess.stdin.on('data', (data) => {
    console.log(`stdin: ${data}`);
  });

  // Print any error
  whisperProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  // Handle data received from child process stdout
  whisperProcess.stdout.on('data', (data) => {
    const receivedData = data.toString();
    console.log(`stdout: ${receivedData}`)
  });
  
  // Create the named pipe (FIFO)
  mkfifo.mkfifoSync("electron", 0o600);

  // Handle child process exit
  whisperProcess.on('exit', (code, signal) => {
    console.log('Child process exited with code:', code);
    // Remove the named pipe (FIFO)
    fs.unlinkSync('electron');
  });

  return whisperProcess
}