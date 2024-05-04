import express from "express";

const router = express.Router();
import { db } from "../connect.js";

router.get("/", async (req, res) => {
  try {
    let q = "SELECT * FROM users";
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json(data);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const { searchfriend } = req.body;
    const { receiverName } = req.body;
    const { user } = req.body;
    const { username } = req.body;
    if (searchfriend) {
      let mssg = "";
      let q = "SELECT * FROM users WHERE username = ?";
      db.query(q, [searchfriend], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json(data);
      });
    } else if (receiverName) {
      await Promise.all([
        db.query("INSERT INTO requests SET ?", {
          userId: 1,
          receiverName: "test",
        }),
        db.query("INSERT INTO sentRequests SET ?", {
          userId: 2,
          senderName: "Neel",
        }),
      ]);
      res.redirect("/search");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    //  file logic with MySQL
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
