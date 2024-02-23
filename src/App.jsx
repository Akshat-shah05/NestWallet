/* eslint-disable react-hooks/exhaustive-deps */
// ^ Eslint was giving me problems with the empty dependency array in the use effect

import './app.css'
import TopStories from './components/TopStories'

function App() {
  // Routes for the top story, and then :storyId for the comments of each story
  return (
    <>
      <TopStories />
    </>
  )
}

export default App
