import React, { useState, useEffect } from "react";
import Post from "../post/Post";
import "./posts.scss";

import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch posts
  const fetchPosts = (cursor) => {
    setIsLoading(true);
    console.log(`before calling api nextcursor` + cursor);
    makeRequest
      .get("/posts", { headers: { cursor: cursor } })
      .then((res) => {
        console.log(`client data` + res.data);
        const { posts: newPosts, nextCursor } = res.data;
        setPosts(newPosts);
        setNextCursor(nextCursor);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      });
  };

  // Function to fetch next page of posts
  const fetchNextPosts = () => {
    fetchPosts(nextCursor);
  };

  // useEffect hook to fetch initial posts when component mounts
  useEffect(() => {
    fetchPosts(nextCursor);
  }, [nextCursor]); // Include nextCursor in the dependency array

  return (
    <div className="posts">
      <h2>All Posts</h2>

      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
      <button onClick={fetchNextPosts} disabled={isLoading}>
        Next
      </button>
    </div>
  );
};

export default Posts;
