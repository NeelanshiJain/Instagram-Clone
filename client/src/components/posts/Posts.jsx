import React, { useState, useEffect, useCallback } from "react";
import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const limit = 2; // Number of posts to fetch per page

  // Function to fetch posts
  const fetchPosts = useCallback(
    (cursor) => {
      makeRequest
        .get(`/posts`, {
          headers: {
            "X-Cursor": cursor,
          },
          params: {
            limit: limit,
          },
        })
        .then((response) => {
          const newPosts = response.data;
          setPosts(newPosts);
          if (newPosts.length > 0) {
            const lastPost = newPosts[newPosts.length - 1];
            setNextCursor(lastPost.createdAt);
          }
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    },
    [limit]
  );

  // Function to fetch next page of posts
  const fetchNextPosts = () => {
    fetchPosts(nextCursor);
  };

  // useEffect hook to fetch initial posts when component mounts
  useEffect(() => {
    fetchPosts(nextCursor); // Fetch initial two posts when component mounts
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="posts">
      <h2>All Posts</h2>

      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      {nextCursor !== null && ( // Render Next button only if nextCursor is not null
        <button onClick={fetchNextPosts}>Next</button>
      )}
    </div>
  );
};

export default Posts;
