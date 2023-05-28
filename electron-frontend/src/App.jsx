import { Router, Route } from 'electron-router-dom'
import SubtitleScreen from './screens/SubtitleScreen'
import MainScreen from './screens/MainScreen'
import SettingsScreen from './screens/SettingsScreen'
import { ChakraBaseProvider } from '@chakra-ui/react'
import { appTheme } from './config/themes'
import { RecoilRoot } from 'recoil'

const App = () => {
  return (
    <RecoilRoot
    >
      <ChakraBaseProvider theme={appTheme}>
        <Router basename="/"
          main={<Route exact path="/" element={<MainScreen />} />}
          subtitles={<Route exact path="/" element={<SubtitleScreen />} />}
          settings={<Route exact path="/" element={<SettingsScreen />} />}
        />
      </ChakraBaseProvider>
    </RecoilRoot>
  )
}

export default App;
