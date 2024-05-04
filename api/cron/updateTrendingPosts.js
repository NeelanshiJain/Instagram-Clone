// updateTrendingPosts.js

import { db } from "../connect.js";

const updateTrendingPosts = () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Calculate timestamp for 24 hours ago

  const qGetPosts = `
    SELECT p.id AS postId, COUNT(l.id) AS likesCount
    FROM posts p
    LEFT JOIN likes l ON p.id = l.postId
    WHERE p.createdAt >= ?
    GROUP BY p.id
    ORDER BY likesCount DESC
  `;

  const qDeleteOldEntries = `TRUNCATE TABLE trending_posts`;

  db.query(qDeleteOldEntries, (deleteErr, deleteResult) => {
    if (deleteErr) {
      console.error("Error deleting old trending posts:", deleteErr);
      return;
    }

    db.query(qGetPosts, [oneDayAgo], (err, results) => {
      if (err) {
        console.error("Error getting posts:", err);
        return;
      }

      const trendingPosts = results.map((row) => [row.postId, row.likesCount]);
      // Check if trendingPosts is not empty
      if (trendingPosts.length === 0) {
        console.log("No trending posts found.");
        return;
      }

      const qInsertTrendingPosts = `INSERT INTO trending_posts (postId, likesCount) VALUES ?`;

      db.query(
        qInsertTrendingPosts,
        [trendingPosts],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting trending posts:", insertErr);
            return;
          }
        }
      );
    });
  });
};

export default updateTrendingPosts;
