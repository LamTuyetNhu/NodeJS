import pool from "../configs/connectDB";
import multer from "multer";

//CRUD
let getHomepage = async (req, res) => {
  // Muốn sử dụng await phải thêm async
  const [rows, fields] = await pool.execute("SELECT * FROM users");
  return res.render("home.ejs", { dataUser: rows });
};

let getDetailPage = async (req, res) => {
  //Lấy id người dùng
  let userId = req.params.id;
  let [user] = await pool.execute(`SELECT * FROM users WHERE id= ?`, [userId]);
  return res.send(JSON.stringify(user));
};

let createNewUser = async (req, res) => {
  let { firstName, lastName, email, address } = req.body;
  await pool.execute(
    "insert into users(firstName, lastName, email, address) values (?, ?, ?, ?)",
    [firstName, lastName, email, address]
  );
  //Quay lai trang home (trang hien tai)
  return res.redirect("/");
};

let deleteUser = async (req, res) => {
  let userId = req.body.userId;
  await pool.execute("delete from users where id = ?", [userId]);
  // return res.send(`${req.body.userId}`);
  return res.redirect("/");
};

let getEditUser = async (req, res) => {
  let id = req.params.id;
  let [user] = await pool.execute("select * from users where id = ?", [id]);
  return res.render("update.ejs", { dataUser: user[0] });
};

let updateUser = async (req, res) => {
  let { firstName, lastName, email, address, id } = req.body;
  await pool.execute(
    "update users set firstName= ?, lastName= ?, email= ?, address= ? where id= ?",
    [firstName, lastName, email, address, id]
  );
  return res.redirect("/");
};

//upload file
let getUploadFilepage = async (req, res) => {
  return res.render("uploadfile.ejs");
};

// const upload = multer().single("profile_pic");
// const uploadMultiple = multer().array("multiple_images", 3);

let handleUploadFile = async (req, res) => {
  // console.log(req.file);

  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.file) {
    return res.send("Please select an image to upload");
  }

  // Display uploaded image for user validation
  return res.send(
    `You have uploaded this image: <hr/><img src="/img/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`
  );
};

let handleUploadMultipleFiles = async (req, res) => {
  if (req.fileValidationError) {
    return res.send(req.fileValidationError);
  } else if (!req.files) {
    return res.send("Please select an image to upload");
  }

  let result = "You have uploaded these images: <hr />";
  const files = req.files;
  // console.log(">>> check files: ", files);
  let index, len;

  // Loop through all the uploaded images and display them on frontend
  for (index = 0, len = files.length; index < len; ++index) {
    result += `<img src="/img/${files[index].filename}" width="300" style="margin-right: 20px;">`;
  }
  result += '<hr/><a href="/upload">Upload more images</a>';
  return res.send(result);
};

let getCreateUser = (req, res) => {
  return res.render("create.ejs");
};

module.exports = {
  getHomepage,
  getDetailPage,
  createNewUser,
  deleteUser,
  getEditUser,
  updateUser,
  getUploadFilepage,
  handleUploadFile,
  handleUploadMultipleFiles,
  getCreateUser,
};
