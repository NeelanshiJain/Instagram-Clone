// routes/bookmarks.js - Backend routes for managing bookmarks
import express from "express";
import {
  addBookmark,
  removeBookmark,
  getBookmarkedPosts,
} from "../controllers/bookmarks.js";

const router = express.Router();

router.post("/", addBookmark);
router.delete("/:postId", removeBookmark);
router.get("/", getBookmarkedPosts);

export default router;
