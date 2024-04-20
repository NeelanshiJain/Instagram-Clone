import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(userId);

    if (err || !userInfo.id) {
      // If user is not logged in or user ID is undefined, fetch only public posts
      const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
      WHERE p.visibility = 'public'
      ORDER BY p.createdAt DESC`;

      db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    } else {
      // If user is logged in, fetch public posts and posts visible to the user and their friends
      const q = `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
      WHERE p.visibility = 'public' OR (p.visibility = 'friends_only' AND (p.userId = ? OR p.userId IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)))
      ORDER BY p.createdAt DESC`;

      const values = [userInfo.id, userInfo.id];

      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    }
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    // Validate visibility
    if (!["public", "friends_only"].includes(req.body.visibility)) {
      return res.status(400).json({ error: "Invalid visibility option" });
    }
    const q =
      "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`,`visibility`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.visibility,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};
export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0)
        return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post");
    });
  });
};

export const editPost = (req, res) => {
  const { id } = req.params;
  const { desc, img } = req.body;

  const q = "UPDATE posts SET `desc` = ?, `img` = ? WHERE `id` = ?";
  const values = [desc, img, id];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post has been updated.");
  });
};
