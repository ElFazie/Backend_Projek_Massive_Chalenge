import path from "path";
import { db } from "../apllication/db.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM user WHERE id = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.acessToken;
  if (!token) return res.status(403).json("Token is not valid!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const sql = "UPDATE user SET `telepon`=?, `alamat`=? WHERE id = ?";
    db.query(
      sql,
      [req.body.telepon, req.body.alamat, userInfo.id],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Account has been updated");
        return res.status(403).json("You can update only your account");
      }
    );
  });
};
