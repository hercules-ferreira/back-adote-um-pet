const router = require("express").Router();

const UserController = require("../controllers/UserController");

// middlewares
const verifyToken = require("../helpers/checkToken");
const { imageUpload } = require("../helpers/imageUpload");
const uploadingImage = require("../middlewares/cloudinary.middleware");

// Routes Private
//
//
// router.put("/image", uploadingImage.single("image"), async (req, res, next) => {
//   try {
//     res.json(req.file);
//   } catch (error) {
//     next(error);
//   }
//   console.log("/image");
// });

// (
//   "/edit/:id",
//   verifyToken,
//   imageUpload.single("image"),
//   UserController.editUser
// );

//
//

//
// new

router.patch(
  "/editimage/:id",
  verifyToken,
  uploadingImage.single("image"),
  UserController.editUser
);

//
//

router.patch(
  "/edit/:id",
  verifyToken,
  imageUpload.single("image"),
  UserController.editUser
);

// routes Public
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);

module.exports = router;
