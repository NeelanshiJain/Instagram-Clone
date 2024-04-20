// controllers/bookmarks.js - Controller logic for managing bookmarks
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const addBookmark = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    console.log(userInfo);
    const query = "INSERT INTO bookmarks (userId, postId) VALUES (?, ?)";
    db.query(query, [userInfo.id, req.body.postId], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Bookmark added successfully.");
    });
  });
};

export const removeBookmark = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.postId;
    const q = "DELETE FROM bookmarks WHERE `postId` = ? AND `userId` = ?";
    db.query(q, [postId, userInfo.id], (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows > 0)
        return res.json("Bookmark removed successfully!");
    });
  });
};

export const getBookmarkedPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const userId = userInfo.id;

    // Step 1: Fetch bookmarked posts based on the user ID
    const query = "SELECT * FROM bookmarks WHERE userId = ?";
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching bookmarked posts:", err);
        return res
          .status(500)
          .json({ error: "Error fetching bookmarked posts" });
      }

      // Step 2: Extract post IDs from bookmarked posts
      const postIds = results.map((bookmark) => bookmark.postId);
      console.log(postIds);
      // Step 3: Fetch details of all bookmarked posts in a single query
      if (postIds.length > 0) {
        const postQuery = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.id IN (?) ORDER BY p.createdAt DESC`;
        db.query(postQuery, [postIds], (err, postDetails) => {
          if (err) {
            console.error("Error fetching post details:", err);
            return res
              .status(500)
              .json({ error: "Error fetching post details" });
          }
          return res.status(200).json(postDetails);
        });
      } else {
        return res.status(200).json([]);
      }
    });
  });
};
