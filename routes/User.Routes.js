const router = require("express").Router();

const UserController = require("../controllers/UserController");

// middlewares
const verifyToken = require("../helpers/checkToken");
const { imageUpload } = require("../helpers/imageUpload");

// Routes Private
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
