/* eslint-disable react-hooks/exhaustive-deps */
// ^ Eslint was giving me problems with the empty dependency array in the use effect
import axios from 'axios'
import { useState, useEffect } from 'react'
import '../app.css'

// Top Stories component --> renders all the top stories
function TopStories() {
  // save topStories to state
  const [topStories, setTopStories] = useState([]);
  const [selectedStoryComments, setSelectedStoryComments] = useState({});

  // useEffect, get top ten stories on first load
  useEffect(() => {
    // async await for promise -- Used axios instead of normal fetch because its much nicer
    async function fetchTopStories() {
      try {

        // Get the id's of each story
        const response = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty");
        const topStoryIds = response.data.slice(0, 10);

        // Fetch the details of each of these Id's --> Use the API Documentation
        // run an async function for EACH story id --> Replace the ID with the detail
        const storyDetails = topStoryIds.map(async (storyId) => {
          const storyResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
          return storyResponse.data;
        });

        // await all promises in storyDetails to be completed
        const stories = await Promise.all(storyDetails);
        setTopStories(stories);

        console.log(topStories);
      } catch (error) {
        console.error('Error fetching top stories:', error);
      }
    }
    fetchTopStories();
  }, [])

  // fetch the comments as a function --> Runs when the button is clicked
  const fetchComments = async (storyId) => {
    try {
      // get the response from each specific storyID
      const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
      const story = response.data;

      // map through this with multiple promises, save it to a variable
      if (story.kids) {
        const commentPromises = story.kids.slice(0, 10).map(async (commentId) => {
          const commentResponse = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
          return commentResponse.data;
        });

        // set the comments --> include the storyID as well so we know which story to render the comment under!
        const commentsData = await Promise.all(commentPromises);
        setSelectedStoryComments({ ...selectedStoryComments, [storyId]: commentsData });
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  return (
    <>
      <div>
        <h1>
          These are the Top 10 stories on Hacker News!
        </h1>
        <ol>
          {topStories.map((story) => (
            <li key={story.id}>
              <div className="story-list">
                {story.title}
                {/* !!! Have to add toggle functionality - Ran out of time :( !!! */}
                <button onClick={() => fetchComments(story.id)}>Load Comments</button>

                {/* Ensure the comments only show up for the specific story chose */}
                <ul>
                {selectedStoryComments[story.id] &&
                  selectedStoryComments[story.id].map((comment) => (
                    <li key={comment.id}>{comment.text}</li>
                  ))}
              </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}

export default TopStories
