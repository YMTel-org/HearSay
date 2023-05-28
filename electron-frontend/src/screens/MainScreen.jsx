// import { ipcMain } from "electron";
import { useEffect, useState } from "react";

const MainScreen = () => {
  useEffect(() => {
    // const getDevices = async () => {
    //   const devices = await window.navigator.mediaDevices.enumerateDevices()
    //   console.log(devices);
    // };

    // getDevices();

    return () => {
      // tis now gets called when the component unmounts
    };
  });

  // TODO: Add some code in settings to select input device, temporarily just use index 0
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState("default");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();

  const handleOpenSettings = () => {
    // Trigger the opening of the settings window
    // You can include this logic in a button click handler or any other appropriate event
    console.log("handleOPensettings")
    window.electronAPI.createNewWindow("settings", {
      minWidth: 700,
      minHeight: 500,
      maxWidth: 700,
      maxHeight: 500,
      title: "Settings",
    })
  };

  const handleRecord = async () => {
    if (!isRecording) {
      setIsRecording(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: selectedInputDeviceId } },
      });
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks = [];
      // Listen for dataavailable event to collect the recorded chunks
      mediaRecorder.addEventListener("dataavailable", (event) => {
        chunks.push(event.data);
      });

      // Listen for stop event to handle the collected chunks
      mediaRecorder.addEventListener("stop", () => {
        const blob = new Blob(chunks, { type: "audio/mp3" }); // specify the MIME type

        // POST the audio data to the server
        fetch("http://localhost:8080/v1/audio/transcriptions", {
          method: "POST",
          body: blob, // directly send the Blob object
          headers: {
            "Content-Type": "audio/mp3", // specify the MIME type
          },
        })
          .then((response) => {
            if (!response.ok) {
              // TODO: handle the error case
              console.error("Failed to upload the audio", response);
            } else {
              console.log("Audio uploaded successfully");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });

      // Start recording the MediaStream
      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);
    } else {
      setIsRecording(false);
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    }
  };
  return (
    <div className="App">
      <p>something</p>
      <button onClick={handleRecord}>
        {isRecording ? "stop" : "start record"}
      </button>
      <button onClick={handleOpenSettings}>Open New Window</button>
    </div>
  );
};

export default MainScreen;
