import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';


const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetchDiscussionsFromApi();
  }, []);

  const fetchDiscussionsFromApi = async () => {
    try {
      const data = await apiService.fetchDiscussions();
      setDiscussions(data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const likeDiscussion = async (id) => {
    try {
      await apiService.handleLike(id);
      // Optimistically update the UI
      setDiscussions(discussions.map(discussion => {
        if (discussion.id === id) {
          return { ...discussion, likes: (discussion.likes || 0) + 1 };
        }
        return discussion;
      }));
    } catch (error) {
      console.error('Error liking discussion:', error);
    }
  };

  const handleDislike = async (id) => {
    try {
      await apiService.dislikeDiscussion(id);
      // Update the discussions state with the new dislike count
      const updatedDiscussions = discussions.map((discussion) => {
        if (discussion.id === id) {
          return { ...discussion, dislikes: discussion.dislikes + 1 };
        }
        return discussion;
      });
      setDiscussions(updatedDiscussions);
    } catch (error) {
      console.error('Error disliking discussion:', error);
    }
  };

  return (
    <div className="discussion-container">
      <h2 className="discussion-heading">All Discussions</h2>
      <ul className="discussion-list">
        {discussions.map((discussion) => (
          <li key={discussion.id} className="discussion-item">
            <Link to={`/discussion/${discussion.id}`} className="discussion-link">{discussion.title}</Link>
            <div className="discussion-actions">
              <button
                onClick={() => likeDiscussion(discussion.id)}
                className="discussion-like"
                title="Like"
              >
                👍
              </button>
              <button
                onClick={() => handleDislike(discussion.id)}
                className="discussion-dislike"
                title="Dislike"
              >
                👎
              </button>
            </div>
            <p className="discussion-stats">Likes: {discussion.likes || 0} | Dislikes: {discussion.dislikes || 0}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiscussionList;



