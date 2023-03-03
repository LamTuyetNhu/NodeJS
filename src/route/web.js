import express from "express";
import multer from "multer";
import path from "path";
import homeController from "../controller/homeController";
var appRoot = require("app-root-path");

let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(">>> check approot: ", appRoot);
    cb(null, appRoot + "/src/public/img/");
  },
  //TRanh trung ten file
  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });
let uploadMultipleFiles = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("multiple_images", 3);

const initWebRoute = (app) => {
  //CRUD
  router.get("/", homeController.getHomepage);
  router.get("/detail/user/:id", homeController.getDetailPage);
  router.post("/create-new-user", homeController.createNewUser);
  router.post("/delete-user", homeController.deleteUser);
  router.get("/edit-user/:id", homeController.getEditUser);
  router.post("/update-user", homeController.updateUser);
  router.get("/create", homeController.getCreateUser);

  //upload
  router.get("/upload", homeController.getUploadFilepage);

  router.post(
    "/upload-profile-pic",
    upload.single("profile_pic"),
    homeController.handleUploadFile
  );

  router.post(
    "/upload-multiple-images",
    (req, res, next) => {
      uploadMultipleFiles(req, res, (err) => {
        if (
          err instanceof multer.MulterError &&
          err.code === "LIMIT_UNEXPECTED_FILE"
        ) {
          // handle multer file limit error here
          res.send("LIMIT_UNEXPECTED_FILE");
        } else if (err) {
          res.send(err);
        } else {
          // make sure to call next() if all was well
          next();
        }
      });
    },
    homeController.handleUploadMultipleFiles
  );

  return app.use("/", router);
};

// module.exports = initWebRoute;
export default initWebRoute;
