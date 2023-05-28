import { Router, Route } from 'electron-router-dom'
import SubtitleScreen from './screens/SubtitleScreen'
import MainScreen from './screens/MainScreen'
import SettingsScreen from './screens/SettingsScreen'

const App = () => {
  return (
    <Router basename="/"
      main={<Route exact path="/" element={<MainScreen />} />}
      subtitles={<Route exact path="/" element={<SubtitleScreen />} />}
      settings={<Route exact path="/" element={<SettingsScreen />} />}
    />
  )
}

export default App;
