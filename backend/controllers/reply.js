import { db } from "../db_connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getReplies = (req, res) => {
  const q = `SELECT r.*, u.id AS userId, name FROM replies AS r JOIN users AS u ON (u.id = r.userId)
    WHERE r.questionId = ?
    `;
    db.query(`USE channel_app`);
  db.query(q, [req.query.questionId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addReply = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "privateKey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO replies(`descrip`, `time`, `userId`, `questionId`) VALUES (?)";
    const values = [
      req.body.descrip,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.questionId
    ];
    db.query(`USE channel_app`);
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Replied to question");
    });
  });
};

export const deleteReply = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const replyId = req.params.id;
    const q = "DELETE FROM replies WHERE `id` = ? AND `userId` = ?";
    db.query(`USE channel_app`);
    db.query(q, [replyId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Reply has been deleted!");
      return res.status(403).json("You can delete only your reply!");
    });
  });
};