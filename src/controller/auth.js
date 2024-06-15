import { db } from "../apllication/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // CHECK USER IS ALREADY REGISTERED
  const sql = "SELECT * FROM user WHERE email = ?";

  db.query(sql, [req.body.email], (err, data) => {
    if (err)
      return res.status(500).json({
        payload: err,
      });
    if (data.length)
      return res.status(409).json({
        message : "Data Sudah Ada Harap Periksa Data Anda"
      });

    const salt = bcrypt.genSaltSync(10);
    const hashedPassowrd = bcrypt.hashSync(req.body.password, salt);

    const sql =
      "INSERT INTO user (nama_depan, nama_belakang, email, password) VALUES (?)";

    const values = [
      req.body.nama_depan,
      req.body.nama_belakang,
      req.body.email,
      hashedPassowrd,
    ];
    db.query(sql, [values], (err, data) => {
      if (err)
        return res.status(500).json({
          payload: err,
        });
      return res.status(200).json({
        payload: {
          message: "User created successfully",
        },
      });
    });
  });
};

export const login = (req, res) => {
  const sql = "SELECT * FROM user WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err)
      return res.status(500).json({
        payload: err,
      });

    if (data.length === 0)
      return res.status(404).json({
        payload: "Email & password not found",
      });

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkPassword)
      return res.status(400).json({
        payload: "Email & password not found",
      });

    const { password, ...others } = data[0];

    const token = jwt.sign({ id: data[0].id }, "secretkey");
    res
      .cookie("acessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const logout = (req, res) => {
  res.clearCookie("acessToken", {
    secure: true,
    sameSite: "none",
  }).status(200).json({ payload: "User logged out" });
};
