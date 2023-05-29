// This is the main process. Here is where can spawn BrowserWindows, etc.

// Module to control the application lifecycle and the native browser window.
const { spawn, exec } = require("child_process");
const { app, shell, BrowserWindow, protocol, ipcMain } = require("electron");
const { createURLRoute } = require("electron-router-dom");
const path = require("path");
const url = require("url");
const fs = require("fs");
const {
  GlobalSharedStateManager,
  SettingsManager,
} = require("electron-shared-state-react/dist/main");

const windows = new Set();
let settings = {};

// Create the native browser window.
function createWindow(id, options) {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
    ...options,
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
  console.log(createURLRoute(appURL, id));
  window.loadURL(createURLRoute(appURL, id));

  // Automatically open Chrome's DevTools in development mode.
  if (!app.isPackaged) {
    window.webContents.openDevTools();
  }

  window.webContents.on("new-window", function (event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  windows.add(window);
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
app.whenReady().then(async () => {
  // Set global window variable to be the MAIN screen
  createWindow("main", {
    title: "Controls",
    height: 180,
    width: 800,
    // uncomment when done with development
    // frame: false
  });

  createWindow("subtitles", {
    width: 450,
    height: 10,
    minHeight: 10,
    title: "Subtitles",
    alwaysOnTop: true,
    useContentSize: true,
    // uncomment when done with development
    frame: false,
  });
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  await SettingsManager.ready();
  GlobalSharedStateManager.ready();
});

app.on("before-quit", async () => {
  SettingsManager.quit();
  GlobalSharedStateManager.quit();
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

ipcMain.on("create-window", (options, id) => {
  createWindow(id, options);
});
