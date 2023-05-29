import { useEffect, useState } from "react";
import { Box, Button, Textarea, Flex, useColorMode } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/icons'
import { AiFillSetting } from 'react-icons/ai';
import { BsFillPlayFill, BsPauseFill,  } from "react-icons/bs";
import { MdOutlineRefresh } from "react-icons/md";
import { useGlobalState } from 'electron-shared-state-react/dist/renderer/useGlobalState'

const MainScreen = () => {
  // TODO: Add some code in settings to select input device, temporarily just use index 0
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState("default");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [theme, setTheme] = useGlobalState('theme', 'light')
  const [language, setLanguage] = useGlobalState('language', 'en')
  const { colorMode, toggleColorMode } = useColorMode()

  const handleOpenSettings = () => {
    // Trigger the opening of the settings window
    // You can include this logic in a button click handler or any other appropriate event
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

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' {...props}>
      <path
        fill='currentColor'
        d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
      />
    </Icon>
  )

  useEffect(() => {
    // sync colorMode and theme
    if (theme !== colorMode) {
      toggleColorMode()
    }

    // change in language
    console.log(language)
  }, [theme, language])

  return (
    <Box color={theme} p={4} width="100%">
      <Flex align="center" mb={4}>
        <Button leftIcon={<CircleIcon boxSize={8} color='red.500' />} />
        <Textarea placeholder='Here is a sample placeholder' flex={1} ml={4} mr={4}/>
        <Button>Translate</Button>
        <p>{language}</p>
      </Flex>
      <Box width="100%">
      <Flex justify="space-between" align="center">
        <Flex justify="center" flex={1}>
          <Button leftIcon={<BsFillPlayFill/>} />
          <Button ml={4} leftIcon={<BsPauseFill/>} />
          <Button ml={4} leftIcon={<MdOutlineRefresh />} />
        </Flex>
        <Button onClick={handleOpenSettings} leftIcon={<AiFillSetting/>} />
      </Flex>    
      </Box>
    </Box>
  );
};

export default MainScreen;
