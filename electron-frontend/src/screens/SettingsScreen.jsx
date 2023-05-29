import {
  Switch,
  Select,
  useColorMode,
  Button,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { settingsAtom } from "../recoil/settingsAtom";
import { useGlobalState } from "electron-shared-state-react/dist/renderer/useGlobalState";
import { useEffect, useState } from "react";

const SettingsScreen = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [theme, setTheme] = useGlobalState("theme", "light");
  const [language, setLanguage] = useGlobalState("language", "en");
  const [translateTo, setTranslateTo] = useGlobalState(
    "translateTo",
    "Chinese"
  );
  const [isOffline, setOffline] = useGlobalState("offline", true);

  // local values that arent set to global unless saved
  const [localLanguage, setLocalLanguage] = useState(language);
  const [localTranslateTo, setLocalTranslateTo] = useState(translateTo);
  const [isLocalOffline, setIsLocalOffline] = useState(isOffline);

  const handleSave = () => {
    setTheme(colorMode);
    setLanguage(localLanguage);
    setTranslateTo(localTranslateTo);
    setOffline(isLocalOffline);
  };

  return (
    <Stack spacing={4} p={20}>
      <h1>Settings</h1>
      <Stack spacing={2}>
        <h2>Transcription Language</h2>
        <Text as="span">
          The language to display for subtitles. Select English for optimized
          speed and accuracy if the audio is entirely in English. Select
          Multilingual otherwise for all audio to be translated to English.
        </Text>
        <Select
          placeholder="Select Language"
          value={localLanguage}
          onChange={(e) => setLocalLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="none">Multilingual</option>
        </Select>
      </Stack>
      <Stack spacing={2}>
        <h2>Reply translation Language</h2>
        <Text as="span">
          The language to translate to reply to the other party.
        </Text>
        <Select
          placeholder="Select Language"
          value={localTranslateTo}
          onChange={(e) => setLocalTranslateTo(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Chinese">Chinese</option>
          <option value="Malay">Malay</option>
        </Select>
      </Stack>
      <Stack spacing={2}>
        <h2>Offline/Online Mode</h2>
        <p>Online mode provides faster and more accurate translations</p>

        <Text as="span">
          <Switch
            size={"lg"}
            colorScheme={"purple"}
            isChecked={!isLocalOffline}
            onChange={() => {
              console.log(isLocalOffline);
              setIsLocalOffline(!isLocalOffline);
            }}
            mr={2}
          />
          {isLocalOffline ? "Offline" : "Online"}
        </Text>
      </Stack>
      <Stack spacing={2}>
        <h2>Light/Dark Mode</h2>
        <p>Are you an early bird or a night owl?</p>
        <Switch
          size={"lg"}
          colorScheme={"purple"}
          isChecked={colorMode === "dark"}
          onChange={toggleColorMode}
        />
      </Stack>
      <Button onClick={handleSave}>Save Changes</Button>
    </Stack>
  );
};

export default SettingsScreen;
