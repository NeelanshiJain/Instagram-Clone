import "./bookmarks.scss";
import Post from "../post/Post";
import React, { useState } from "react";
//import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
// import { useContext } from "react";
// import { AuthContext } from "../../context/authContext";

const BookMarks = () => {
  const [bookmarks, setBookMarks] = useState([]);
  //const { currentUser } = useContext(AuthContext);

  useQuery(["bookmarks"], () =>
    makeRequest.get("/bookmarks").then((res) => {
      setBookMarks(res.data);
      return res.data;
    })
  );

  // const BookMarks = ({ id }) => {
  //   const [bookmarks, setBookMarks] = useState([]);

  //   useEffect(() => {
  //     const fetchBookMarks = async () => {
  //       try {
  //         const response = await axios.get(
  //           "http://localhost:8800/api/bookmarks/"
  //         );
  //         setBookMarks(response.data);
  //       } catch (error) {
  //         console.error("Error fetching trending posts:", error);
  //       }
  //     };
  //     fetchBookMarks();
  //   }, []);

  return (
    <div>
      <h2>BookMarks</h2>
      <br></br>
      <div>
        {bookmarks.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default BookMarks;
