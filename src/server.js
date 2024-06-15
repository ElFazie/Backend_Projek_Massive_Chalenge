import express from "express";
import userRouter from "./route/user.js";
import authRouter from "./route/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import logger from "./midleware/logger.js";

const app = express();
app.use(logger);
// app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);

  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:2000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../src/public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer ({storage : storage})


app.post("/api/v1/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
})
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
