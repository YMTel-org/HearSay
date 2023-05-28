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
  })

  // TODO: Add some code in settings to select input device, temporarily just use index 0
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState('default');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();

  const handleOpenNewWindow = () => {
    // Trigger the opening of the new window
    // You can include this logic in a button click handler or any other appropriate event
    const newWindow = window.open('new-window', '_blank');
    newWindow.location = 'http://localhost:3000/#/subtitles'; // Replace with the desired URL or route to the NewWindow component
  };

  const handleRecord = async () => {
    if (!isRecording) {
      setIsRecording(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: selectedInputDeviceId } } })
      const mediaRecorder = new MediaRecorder(mediaStream)
      const chunks = [];
      // Listen for dataavailable event to collect the recorded chunks
      mediaRecorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data);
      });

      // Listen for stop event to handle the collected chunks
      mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(chunks);
        const fileReader = new FileReader();
        fileReader.addEventListener('load', async () => {
          // Get the base64-encoded data URL
          const arrayBuffer = fileReader.result;
          const uint8Array = new Uint8Array(arrayBuffer);
          window.electronAPI.sendAudioData(uint8Array)
        });
        fileReader.readAsArrayBuffer(blob);
      });
      // Start recording the MediaStream
      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);
    } else {
      setIsRecording(false)
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    }
  }
  return (
    <div className="App">
      <p>something</p>
      <button onClick={handleRecord}>{isRecording ? "stop" : "start record"}</button>
      <button onClick={handleOpenNewWindow}>Open New Window</button>
    </div>
  );
}

export default MainScreen;
