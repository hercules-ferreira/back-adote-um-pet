const router = require("express").Router();

const BirdController = require("../controllers/BirdController");

// middlewares
const verifyToken = require("../helpers/checkToken");
const { imageUpload } = require("../helpers/imageUpload");

// Router Private
router.post(
  "/create",
  imageUpload.array("images"),
  verifyToken,
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
