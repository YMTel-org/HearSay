import {
  Switch,
  Select,
  useColorMode,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { settingsAtom } from '../recoil/settingsAtom'
import "./SettingsScreen.css"

const SettingsScreen = () => {
  const [settings, setSettings] = useRecoilState(settingsAtom)
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className='SettingsScreen'>
      <h1>Settings</h1>
      <div className='Section'>
        <h2>Spoken Language</h2>
        <p>The language you are going to be speaking. If you select English, it means that you are only going to be speaking English - the transcription will be faster and more accurate.</p>
        <Select placeholder='Select Language' value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })}>
          <option value='en'>English</option>
          <option value='none'>Multilingual</option>
        </Select>
      </div>
      <div className='Section'>
        <h2>Light/Dark Mode</h2>
        <p>Are you an early bird or a night owl?</p>
        <Switch size={"lg"} color={"green.400"} colorScheme={"purple"} value={colorMode === "dark"} onChange={toggleColorMode}/>
      </div>
    </div>
  )
}

export default SettingsScreen