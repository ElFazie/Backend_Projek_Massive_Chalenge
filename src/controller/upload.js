import express from "express";
import path from "path";
import upload from "../midleware/multer.js";

const uploadFile = (req, res) => {
  upload(req, res, (err) => {
    return res.status(400).send({ message: err });
  });
  res.status(201).json({
    payload: {
      message: "File Uploaded",
      file: req.file,
    },
  });
};

export {uploadFile}
