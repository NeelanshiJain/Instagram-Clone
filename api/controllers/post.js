import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  const cursor = req.headers.cursor;

  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    let baseQuery = `
      SELECT p.*, u.id AS userId, name, profilePic 
      FROM posts AS p 
      JOIN users AS u ON (u.id = p.userId)
    `;
    let condition = "";
    let values = [];

    if (!userInfo || !userInfo.id) {
      condition = " WHERE p.visibility = 'public'";
    } else {
      condition = `
        WHERE p.visibility = 'public' OR 
        (p.visibility = 'friends_only' AND (
          p.userId = ? OR 
          p.userId IN (SELECT followedUserId FROM relationships WHERE followerUserId = ?)
        ))
      `;
      values = [userInfo.id, userInfo.id];
    }

    if (cursor) {
      condition += " AND p.createdAt < ?";
      values.push(cursor);
    }

    baseQuery += condition + " ORDER BY p.createdAt DESC LIMIT 5";
    console.log(baseQuery);
    console.log(values);
    db.query(baseQuery, values, (err, data) => {
      if (err) return res.status(500).json(err);

      const hasNextPage = data.length === 2; // Check if there are more posts
      // Extract the next cursor from the data
      const nextCursor = hasNextPage ? data[data.length - 1].createdAt : null;

      // Format the nextCursor to match the format in the database
      const formattedNextCursor = nextCursor
        ? moment(nextCursor).format("YYYY-MM-DD HH:mm:ss")
        : null;

      // Set the nextCursor in the response headers
      if (formattedNextCursor) {
        res.setHeader("nextCursor", formattedNextCursor);
      }
      const responseData = {
        posts: data,
        hasNextPage: hasNextPage,
        nextCursor: formattedNextCursor,
      };
      console.log(`previouscursor` + cursor);
      console.log(`nextcursor` + formattedNextCursor);
      console.log(`resonsedata` + responseData.nextCursor);
      return res.status(200).json(responseData);
    });
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

export const getTrendingPosts = (req, res) => {
  const q = `SELECT p.*, tp.likesCount, u.id AS userId, name, profilePic 
  FROM trending_posts AS tp
  JOIN posts AS p ON tp.postId = p.id
  JOIN users AS u ON p.userId = u.id`;

  db.query(q, (err, data) => {
    if (err) {
      console.error("Error fetching trending posts:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(data);
  });
};
