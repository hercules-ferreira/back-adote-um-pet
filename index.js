const conn = require("./db/conn");

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Config JSON response
app.use(express.json());

// Solve CORS - autoriza outras requisições de front se conectar à este back
app.use(cors({ credentials: true, origin: process.env.ORIGIN }));

// Public folder for images
app.use(express.static("public"));

// Routes
const BirdRoutes = require("./routes/Bird.Routes");
const FishRoutes = require("./routes/Fish.Routes");
const PetRoutes = require("./routes/Pet.Routes");
const UserRoutes = require("./routes/User.Routes");

app.use("/birds", BirdRoutes);
app.use("/fishs", FishRoutes);
app.use("/pets", PetRoutes);
app.use("/users", UserRoutes);

const PORT = process.env.PORT;

conn().then(() => {
  app.listen(PORT, () => console.log(`Servidor executando na porta: ${PORT}`));
});
