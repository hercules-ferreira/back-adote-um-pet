const router = require("express").Router();

const PetController = require("../controllers/PetController");

// middlewares
const verifyToken = require("../helpers/checkToken");
const { imageUpload } = require("../helpers/imageUpload");

// Router Private
router.post(
  "/create",
  verifyToken,
  imageUpload.array("images"),
  PetController.create
);
router.get("/mypets", verifyToken, PetController.getAllUserPets);
router.get("/myadoptions", verifyToken, PetController.getAllUserAdoptions);

//

//

router.delete("/:id", verifyToken, PetController.removePetById);
router.patch(
  "/:id",
  verifyToken,
  imageUpload.array("images"),
  PetController.updatePet
);
router.patch("/schedule/:id", verifyToken, PetController.schedule);
router.patch("/conclude/:id", verifyToken, PetController.concludeAdoption);

// Router Public
router.get("/", PetController.getAll);
router.get("/:id", PetController.getPetById);

module.exports = router;
