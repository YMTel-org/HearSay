import { useEffect, useState } from "react";
import { Box, Button, Textarea, Flex } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons'
import { AiFillSetting } from 'react-icons/ai';
import { BsFillPlayFill, BsPauseFill,  } from "react-icons/bs";
import { MdOutlineRefresh } from "react-icons/md";


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

  const handleOpenNewWindow = () => {
    // Trigger the opening of the new window
    // You can include this logic in a button click handler or any other appropriate event
    const newWindow = window.open("new-window", "_blank");
    newWindow.location = "http://localhost:3000/#/subtitles"; // Replace with the desired URL or route to the NewWindow component
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
        const fileName = "recorded_audio.mp3";

        // Initialize FormData and append the Blob audio data, model, language, and translate values
        var formData = new FormData();
        formData.append("file", blob, fileName);
        formData.append("model", "whisper-1");
        formData.append("language", "en");
        formData.append("translate", "true");

        // POST the audio data to the server
        fetch("http://localhost:8080/v1/audio/transcriptions", {
          method: "POST",
          body: formData, // directly send the FormData object
        })
          .then((response) => response.text())
          .then((result) => console.log(result))
          .catch((error) => console.error("Error:", error));
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

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
      <path
        fill='currentColor'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  )

  return (
    <Box p={4} width="100%">
      <Flex align="center" mb={4}>
        <Button leftIcon={<CircleIcon boxSize={8} color='red.500' />} />
        <Textarea placeholder='Here is a sample placeholder' flex={1} ml={4} mr={4}/>
        <Button>Translate</Button>
      </Flex>
      <Box width="100%">
      <Flex justify="space-between" align="center">
        <Flex justify="center" flex={1}>
          <Button leftIcon={<BsFillPlayFill/>} />
          <Button ml={4} leftIcon={<BsPauseFill/>} />
          <Button ml={4} leftIcon={<MdOutlineRefresh />} />
        </Flex>
        <Button leftIcon={<AiFillSetting/>} />
      </Flex>
        
      </Box>
    </Box>
    // <div className="App">
    //   <p>something</p>
    //   <button onClick={handleRecord}>
    //     {isRecording ? "stop" : "start record"}
    //   </button>
    //   <button onClick={handleOpenNewWindow}>Open New Window</button>
    // </div>
  );
};

export default MainScreen;
