import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Textarea,
  Flex,
  useColorMode,
  IconButton,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { BsFillPlayFill, BsPauseFill } from "react-icons/bs";
import { MdOutlineRefresh } from "react-icons/md";
import { useGlobalState } from "electron-shared-state-react/dist/renderer/useGlobalState";
import TextDecoderStream from "../utils/TextDecoderStream";
import { AiFillSave, AiFillSetting } from "react-icons/ai";
import { BsStopFill } from "react-icons/bs";
import FileSaver from "file-saver";
const LanguageToCode = {
  English: "en",
  Malay: "ms",
  Chinese: "zh",
};

const MainScreen = () => {
  // TODO: Add some code in settings to select input device, temporarily just use index 0
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState("default");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState();
  const [theme, setTheme] = useGlobalState("theme", "light");
  const [language, setLanguage] = useGlobalState("language", "en");

  const [translateTo, setTranslateTo] = useGlobalState(
    "translateTo",
    "Chinese"
  );
  const [isOffline, setOffline] = useGlobalState("offline", true);

  const { colorMode, toggleColorMode } = useColorMode();
  const [text, setText] = useState("");
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [isMinutesLoading, setIsMinutesLoading] = useState(false);

  const translateWithLLM = async (prompt) => {
    setText("Loading... Please Wait...");
    setIsTranslationLoading(true);
    const response = await fetch("http://localhost:8080/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "vicuna",
        prompt: `Translate the following into ${translateTo}: ${text}}`,
      }),
    });
    if (!response.body) return;
    const reader = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();
    var { value, done } = await reader.read();
    if (value) {
      console.log(value);
      const parsed = JSON.parse(value);
      console.log(parsed.choices[0].text);
      if (parsed.choices[0].text) {
        console.log(parsed.choices[0].text);
        setText(parsed.choices[0].text);
      }
    }
    setIsTranslationLoading(false);
  };

  const translateOnline = async (prompt) => {
    setText("Loading... Please Wait...");
    setIsTranslationLoading(true);

    const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
      text
    )}&source=en&target=${LanguageToCode[translateTo]}&format=text&model=base`;

    const response = await fetch(url, {
      method: "POST",
    });

    // const translatedText = await translate(text, {
    //   to: LanguageToCode[translateTo],
    //   fetchOptions: { agent },
    // });
    console.log(response);
    // setText(translatedText);
    setIsTranslationLoading(false);
  };
  const [tFile, setTFile] = useState();

  useEffect(() => {
    const file = new Blob([], { type: "text/plain" });
    setTFile(file);
  }, []);

  const handleOpenSettings = () => {
    // Trigger the opening of the settings window
    // You can include this logic in a button click handler or any other appropriate event
    window.electronAPI.createNewWindow("settings", {
      minWidth: 700,
      minHeight: 500,
      maxWidth: 700,
      maxHeight: 500,
      title: "Settings",
    });
  };

  const handleStart = () => {
    console.log("Start");
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (!speechSynthesis.speaking) {
      let speech = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(speech);
    }
  };

  const handleStop = async () => {
    console.log("Stop");
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  };

  const handleRestart = async () => {
    speechSynthesis.cancel();
  };

  const handleTranslate = () => {
    if (isOffline) {
      translateWithLLM(text);
    } else {
      translateOnline(text);
    }
  };

  const handleTextareaChange = (event) => {
    setText(event.target.value);
  };

  // const onTranscribe = async (blob) => {
  //   const fileName = "recorded_audio.mp3";

  //   // Initialize FormData and append the Blob audio data, model, language, and translate values
  //   var formData = new FormData();
  //   formData.append("file", blob, fileName);
  //   formData.append("model", "whisper-1");
  //   formData.append("language", "en");
  //   formData.append("translate", "true");

  //   const response = fetch("http://localhost:8080/v1/audio/transcriptions", {
  //         method: "POST",
  //         body: formData, // directly send the FormData object
  //       })
  //         .then((response) => response.text())
  //         .then((result) => result)
  //         .catch((error) => console.error("Error:", error));
  //   console.log(response)
  //   // you must return result from your server in Transcript format
  //   return {
  //     blob,
  //     response,
  //   }
  // }

  // const {
  //   recording,
  //   speaking,
  //   transcribing,
  //   transcript,
  //   pauseRecording,
  //   startRecording,
  //   stopRecording,
  //  } = useWhisper({
  //   // callback to handle transcription with custom server
  //   onTranscribe,
  // })

  const handleRecord = async () => {
    if (!isRecording) {
      // startRecording()
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
      // TODO: Can try changing this to setInterval - so far I tried it doesn't work, some ffmpeg error from server side.
      mediaRecorder.addEventListener("stop", async () => {
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
          .then((result) => {
            setText(JSON.parse(result).text);
          })
          .catch((error) => console.error("Error:", error));
      });

      // Start recording the MediaStream
      mediaRecorder.start();
      setMediaRecorder(mediaRecorder);
    } else {
      // stopRecording()
      setIsRecording(false);
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    }
  };

  const CircleIcon = (props) => (
    <Icon viewBox="0 0 200 200" {...props}>
      <path
        fill="currentColor"
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
      />
    </Icon>
  );

  useEffect(() => {
    // sync colorMode and theme
    if (theme !== colorMode) {
      toggleColorMode();
    }

    // change in language
    console.log(language);
  }, [theme, language]);

  useEffect(() => {
    if (text && tFile) {
      const appendedBlob = new Blob([tFile, "\n", text], {
        type: "text/plain",
      });
      console.log(appendedBlob);
      setTFile(appendedBlob);
    }
  }, [text]);

  const saveTranscript = () => {
    FileSaver.saveAs(tFile, "transcript.txt");
  };

  const [fileContents, setFileContents] = useState("");

  const handleFileUpload = async (file) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        setIsMinutesLoading(true);
        const contents = e.target.result;
        setFileContents(contents);
        console.log(contents);

        const payload = {
          model: "vicuna",
          prompt:
            "Summarise the following into meeting minutes in point form, in markdown notation:" +
            contents,
        };

        const response = await fetch("http://localhost:8080/v1/completions", {
          method: "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Successful response handling
          console.log("Data posted successfully!");
          console.log(response);
          const parsed = await response.json();
          console.log(parsed.choices[0].text);
          const file = new Blob([parsed.choices[0].text], {
            type: "text/plain",
          });
          FileSaver.saveAs(file, "meeting_minutes.txt");
        } else {
          // Error handling
          console.error("Error posting data:", response.status);
        }
        setIsMinutesLoading(false);
      };

      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    const inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = ".txt";
    inputElement.onchange = (event) => {
      const file = event.target.files[0];
      handleFileUpload(file);
    };
    inputElement.click();
  };

  return (
    <Box color={theme} p={4} width="100%">
      <Flex align="center" mb={4}>
        <IconButton
          icon={
            isRecording ? (
              <BsStopFill />
            ) : (
              <CircleIcon boxSize={8} color="red.500" />
            )
          }
          onClick={handleRecord}
        />
        <IconButton ml={1} icon={<AiFillSave />} onClick={saveTranscript} />
        <Textarea
          isDisabled={isTranslationLoading}
          placeholder={"Enter text here"}
          value={text}
          onChange={handleTextareaChange}
          flex={1}
          ml={4}
          mr={4}
        />
        <Button onClick={handleTranslate} isLoading={isTranslationLoading}>
          Translate
        </Button>
      </Flex>
      <Box width="100%">
        <Flex justify="space-between" align="center">
          <Flex justify="center" flex={1}>
            <IconButton icon={<BsFillPlayFill />} onClick={handleStart} />
            <IconButton ml={4} icon={<BsPauseFill />} onClick={handleStop} />
            <IconButton
              ml={4}
              icon={<MdOutlineRefresh />}
              onClick={handleRestart}
            />
          </Flex>
          <Button onClick={handleButtonClick} isLoading={isMinutesLoading}>
            Create Meeting Minutes
          </Button>
          <IconButton
            ml={4}
            onClick={handleOpenSettings}
            icon={<AiFillSetting />}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default MainScreen;
