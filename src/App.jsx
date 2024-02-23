/* eslint-disable react-hooks/exhaustive-deps */
// ^ Eslint was giving me problems with the empty dependency array in the use effect

import './app.css'
import TopStories from './components/TopStories'

function App() {
  return (
    <>
      <TopStories />
    </>
  )
}

export default App
