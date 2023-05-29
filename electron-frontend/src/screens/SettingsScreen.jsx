import {
  Switch,
  Select,
  useColorMode,
  Button,
} from '@chakra-ui/react'
import { useRecoilState } from 'recoil'
import { settingsAtom } from '../recoil/settingsAtom'
import "./SettingsScreen.css"
import { useGlobalState } from 'electron-shared-state-react/dist/renderer/useGlobalState'
import { useEffect, useState } from 'react'

const SettingsScreen = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [theme, setTheme] = useGlobalState('theme')
  const [language, setLanguage] = useGlobalState('language')
  const [localLanguage, setLocalLanguage] = useState(language)

  const handleSave = () => {
    setTheme(colorMode)
    console.log(localLanguage)
    setLanguage(localLanguage)
  }

  return (
    <div className='SettingsScreen'>
      <h1>Settings</h1>
      <div className='Section'>
        <h2>Spoken Language</h2>
        <p>The language you are going to be speaking. If you select English, it means that you are only going to be speaking English - the transcription will be faster and more accurate.</p>
        <Select placeholder='Select Language' value={localLanguage} onChange={(e) => setLocalLanguage(e.target.value)}>
          <option value='en'>English</option>
          <option value='none'>Multilingual</option>
        </Select>
      </div>
      <div className='Section'>
        <h2>Light/Dark Mode</h2>
        <p>Are you an early bird or a night owl?</p>
        <Switch size={"lg"} colorScheme={"purple"} isChecked={colorMode === "dark"} onChange={toggleColorMode}/>
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}

export default SettingsScreen