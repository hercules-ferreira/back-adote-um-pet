const router = require("express").Router();

const FishController = require("../controllers/FishControllerNew");

// middlewares
const verifyToken = require("../helpers/checkToken");
const { imageUpload } = require("../helpers/imageUpload");
const uploadingImagefish = require("../middlewares/cloudinary.middleware");

// Router Private

//
//
// new
router.post(
  "/createfish",
  verifyToken,
  uploadingImagefish.single("images"),
  FishController.create
);

//
//

router.post(
  "/createfish",
  verifyToken,
  imageUpload.array("images"),
  FishController.create
);
router.get("/myfishs", verifyToken, FishController.getAllUserFishs);
router.get("/myadoptions", verifyToken, FishController.getAllUserAdoptions);

//
router.get("/:id", verifyToken, FishController.getFishById);

//

router.delete("/:id", verifyToken, FishController.removeFishById);
router.patch(
  "/:id",
  verifyToken,
  imageUpload.array("images"),
  FishController.updateFish
);
router.patch("/schedule/:id", verifyToken, FishController.schedule);
router.patch("/conclude/:id", verifyToken, FishController.concludeAdoption);

// Router Public
router.get("/", FishController.getAll);
router.get("/:id", FishController.getFishById);

module.exports = router;
