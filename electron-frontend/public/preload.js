// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

const { Platform, StateChannel } = require('electron-shared-state-react/dist/renderer/platform');

function getStateForChannel(channel, key) {
  return ipcRenderer.invoke(`${channel}:getState`, key)
}

function setStateForChannel(channel, key, value, source) {
  return ipcRenderer.invoke(`${channel}:setState`, key, value, source)
}

function subscribeToKey(channel, key, updatedValue) {
  ipcRenderer.addListener(
    `${channel}:updatedValue:${key}`,
    updatedValue
  )
  ipcRenderer.send(`${channel}:watchKey`, key)

  getStateForChannel(channel, key).then((result) => {
    updatedValue(key, result.value)
  })

  return () => {
    ipcRenderer.removeListener(
      `${channel}:updatedValue:${key}`,
      updatedValue
    )
    ipcRenderer.send(`${channel}:unwatchKey`, key)
  }
}

const rendererPlatform = { setStateForChannel, subscribeToKey, getStateForChannel }


// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
  contextBridge.exposeInMainWorld("electronAPI", {
    sendAudioData: (data) => {
      ipcRenderer.send("send-audio-data", data)
    },
    createNewWindow: (id, options) => {
      ipcRenderer.send("create-window", id, options)
    },
    // functions which handle shared state
    rendererPlatform,
  });
});