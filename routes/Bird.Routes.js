const router = require("express").Router();

const BirdController = require("../controllers/BirdControllerNew");

// middlewares
const verifyToken = require("../helpers/checkToken");
const { imageUpload } = require("../helpers/imageUpload");
const uploadingImagebird = require("../middlewares/cloudinary.middleware");

// Router Private

//
//
// new
router.post(
  "/createbird",
  verifyToken,
  uploadingImagebird.single("images"),
  BirdController.create
);

//
//

router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  BirdController.create
);

router.get("/mybirds", verifyToken, BirdController.getAllUserBirds);

router.get("/myadoptions", verifyToken, BirdController.getAllUserAdoptions);
router.delete("/:id", verifyToken, BirdController.removeBirdById);
router.patch(
  "/:id",
  imageUpload.array("images"),
  verifyToken,
  BirdController.updateBird
);

//

//

router.patch("/schedule/:id", verifyToken, BirdController.schedule);
router.patch("/conclude/:id", verifyToken, BirdController.concludeAdoption);

// Router Public
router.get("/:id", BirdController.getBirdById);
router.get("/", BirdController.getAll);

module.exports = router;
