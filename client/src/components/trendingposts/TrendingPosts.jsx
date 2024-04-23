// components/TrendingPosts.jsx

// import Post from "../post/Post";
// import { useQuery } from "@tanstack/react-query";
// import { makeRequest } from "../../axios";
import "./trendingpost.scss";
import Post from "../post/Post";
import React, { useEffect, useState } from "react";
import axios from "axios";

const TrendingPosts = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/posts/trending"
        );
        setTrendingPosts(response.data);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      }
    };
    fetchTrendingPosts();
  }, []);

  return (
    <div>
      <h2>Trending Posts</h2>
      <br></br>
      <div>
        {trendingPosts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};
export default TrendingPosts;
