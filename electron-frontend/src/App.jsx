import { Router, Route } from 'electron-router-dom'
import SubtitleScreen from './screens/SubtitleScreen'
import MainScreen from './screens/MainScreen'
import SettingsScreen from './screens/SettingsScreen'
import { ChakraBaseProvider } from '@chakra-ui/react'

const App = () => {
  return (
    <ChakraBaseProvider>
      <Router basename="/"
        main={<Route exact path="/" element={<MainScreen />} />}
        subtitles={<Route exact path="/" element={<SubtitleScreen />} />}
        settings={<Route exact path="/" element={<SettingsScreen />} />}
      />
    </ChakraBaseProvider>
  )
}

export default App;
