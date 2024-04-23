import express from "express";
import {
  getPosts,
  addPost,
  deletePost,
  editPost,
  getTrendingPosts,
} from "../controllers/post.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.put("/:id", editPost); // New PUT endpoint for editing posts
router.get("/trending", getTrendingPosts);
router.delete("/:id", deletePost);

export default router;
