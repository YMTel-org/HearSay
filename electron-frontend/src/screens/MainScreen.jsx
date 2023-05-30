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
  const [gender, setGender] = useGlobalState("gender", "Male");
  const [transcript, setTranscript] = useGlobalState("transcript", "");
  const [textAreaText, setTextAreaText] = useState("");
  const [translateTo, setTranslateTo] = useGlobalState(
    "translateTo",
    "Chinese"
  );
  const [isOffline, setOffline] = useGlobalState("offline", true);

  const { colorMode, toggleColorMode } = useColorMode();
  const [text, setText] = useState("");
  const [isTranslationLoading, setIsTranslationLoading] = useState(false);
  const [isMinutesLoading, setIsMinutesLoading] = useState(false);

  const getVoiceURI = () => {
    const isWindows =
      getVoiceByURI("Microsoft David - English (United States)") !== null;

    if (isWindows) {
      if (gender === "Male") {
        switch (translateTo) {
          case "English":
            return "Microsoft David - English (United States)";
          case "Chinese":
            return "Microsoft Kangkang - Chinese (Simplified, PRC)";
          case "Malay":
            return "Microsoft Rizwan - Malay (Malaysia)";
          default:
            return "Microsoft David - English (United States)";
        }
      } else {
        switch (translateTo) {
          case "English":
            return "Microsoft Zira - English (United States)";
          case "Chinese":
            return "Microsoft Yaoyao - Chinese (Simplified, PRC)";
          // No female malay voice in Microsoft
          case "Malay":
            return "Microsoft Rizwan - Malay (Malaysia)";
          default:
            return "Microsoft Zira - English (United States)";
        }
      }
    } else {
      if (gender === "Male") {
        switch (translateTo) {
          case "English":
            return "Daniel";
          case "Chinese":
            return "Li-Mu Siri";
          default:
            return "Daniel";
        }
      } else {
        switch (translateTo) {
          case "English":
            return "Kate";
          case "Chinese":
            return "Ting-Ting";
          default:
            return "Kate";
        }
      }
    }
  };

  function getVoiceByURI(voiceURI) {
    const voices = speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
      if (voices[i].voiceURI === voiceURI) {
        return voices[i];
      }
    }

    // Return null or handle the case when no matching voice is found
    return null;
  }

  const translateWithLLM = async (prompt) => {
    setTextAreaText("Loading... Please Wait...");
    setIsTranslationLoading(true);
    const response = await fetch("http://localhost:8080/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "vicuna",
        prompt: `Translate the following into ${translateTo}: ${prompt}}`,
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
        setTextAreaText(parsed.choices[0].text);
      }
    }
    setIsTranslationLoading(false);
  };

  const translateOnline = async (prompt) => {
    setTextAreaText("Loading... Please Wait...");
    setIsTranslationLoading(true);

    const apiKey = process.env.REACT_APP_TRANSLATE_API_KEY;

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(
      prompt
    )}&source=en&target=${LanguageToCode[translateTo]}&format=text&model=base`;

    const response = await fetch(url, {
      method: "POST",
    });
    const { data } = await response.json();
    setTextAreaText(data.translations[0].translatedText);
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

  useEffect(() => {
    const temp = new SpeechSynthesisUtterance("");
    speechSynthesis.speak(temp);
  }, []);

  const handleStart = () => {
    console.log("Start");
    console.log(speechSynthesis.getVoices());
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    } else if (!speechSynthesis.speaking) {
      let speech = new SpeechSynthesisUtterance(textAreaText);
      console.log(getVoiceByURI(getVoiceURI()));

      speech.voice = getVoiceByURI(getVoiceURI()); // Set the language code based on the selected language
      speechSynthesis.speak(speech);
    }
  };

  // Function to get the language code based on the selected language
  const getLanguageCode = (language) => {
    switch (language) {
      case "English":
        return "en-US";
      case "Chinese":
        return "zh-CN";
      default:
        return "en-US";
    }
  };

  const handlePause = async () => {
    console.log("Pause");
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
    }
  };

  const handleRestart = async () => {
    console.log("Restart");
    speechSynthesis.cancel();
    handleStart();
  };

  const handleTranslate = () => {
    if (isOffline) {
      translateWithLLM(textAreaText);
    } else {
      translateOnline(textAreaText);
    }
  };

  const handleTextareaChange = (event) => {
    setTextAreaText(event.target.value);
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
      mediaRecorder.addEventListener("stop", async () => {
        const blob = new Blob(chunks, { type: "audio/mp3" }); // specify the MIME type
        const fileName = "recorded_audio.mp3";

        // Initialize FormData and append the Blob audio data, model, language, and translate values
        var formData = new FormData();
        formData.append("file", blob, fileName);

        let model = "whisper-base-en";
        if (language !== "en") {
          model = "whisper-base";
        }

        formData.append("model", model);
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
      if (mediaRecorder && mediaRecorder.state === "recording") {
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

  // when text changes
  useEffect(() => {
    if (text) {
      const newTranscript = transcript + "\n" + text;
      setTranscript(newTranscript);
    }

    if (text && tFile) {
      const appendedBlob = new Blob([tFile, "\n", text], {
        type: "text/plain",
      });
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
      <Flex align="start" direction={"column"} mb={4}>
        <Flex mt={2} justify="start" flex={1} marginBottom={4}>
          <Flex justify="start" align={"start"} flex={1} mr={8}>
            <h2>Transcription</h2>
          </Flex>
          <Flex justify="center" align={"center"} flex={4}>
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
            <IconButton ml={4} icon={<AiFillSave />} onClick={saveTranscript} />
            <Button
              width={80}
              ml={4}
              onClick={handleButtonClick}
              isLoading={isMinutesLoading}
            >
              Create Meeting Minutes
            </Button>
          </Flex>
        </Flex>
        <h2>Translation</h2>
        <Textarea
          isDisabled={isTranslationLoading}
          placeholder={"Enter text here"}
          value={textAreaText}
          onChange={handleTextareaChange}
          flex={1}
          mt={2}
        />
      </Flex>
      <Box width="100%">
        <Flex justify="space-between">
          <Flex justify="center" flex={1}>
            <Button
              onClick={handleTranslate}
              isLoading={isTranslationLoading}
              mr={4}
            >
              Translate
            </Button>
            <IconButton icon={<BsFillPlayFill />} onClick={handleStart} />
            <IconButton ml={4} icon={<BsPauseFill />} onClick={handlePause} />
            <IconButton
              ml={4}
              icon={<MdOutlineRefresh />}
              onClick={handleRestart}
            />
          </Flex>
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
