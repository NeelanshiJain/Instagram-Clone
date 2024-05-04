import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
function SearchFriends() {
  const [searchFriend, setSearchFriend] = useState("");
  const [result, setResult] = useState([]);
  // const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchAllusers = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/search");
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      }
    };
    fetchAllusers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8800/api/search", {
        searchfriend: searchFriend,
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddFriend = async (username, userId) => {
    try {
      await axios.post("http://localhost:8800/api/", {
        receiverName: username,
        user: userId,
      });
      // Handle success or update UI accordingly
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Search Friends</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="searchfriend"
          placeholder="Username"
          value={searchFriend}
          onChange={(e) => setSearchFriend(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <hr />
      <div className="row">
        {result.map((user) => (
          <div key={user.id} className="usercard col-lg-3">
            <img
              className="usercard-image"
              src={
                user.coverPic !== null ? user.coverPic : "upload/default.png"
              }
              alt={`${user.name}`}
            />
            <h4 className="usercard-name">{user.name}</h4>
            <p className="usercard-username">@{user.username}</p>
            <button
              type="button"
              onClick={() => handleAddFriend(user.username, user.id)}
              className="btn add accept friend-add"
            >
              <i className="fa fa-user"></i> Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchFriends;
