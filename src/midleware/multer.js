import multer from "multer";

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    cb(null, "../public/images");
  },
  filename: (_, file, cb) => {
    const fileName = new Date().getTime().toString() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  }
  cb(new Error("Only .png, .jpg and .jpeg format allowed!"), false);
};

const upload = multer({ storage, fileFilter }).single("image");
export default upload;
