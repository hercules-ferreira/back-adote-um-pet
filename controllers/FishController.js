const Fish = require("../models/Fish");

// helpers
const getUserByToken = require("../helpers/getUserByToken");
const getToken = require("../helpers/getToken");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class FishController {
  // create a Fish
  static async create(req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const description = req.body.description;
    const weight = req.body.weight;
    const color = req.body.color;
    const images = req.files;
    const available = true;

    // console.log(req.body)
    // console.log(images);
    // return

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    }

    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório!" });
      return;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória!" });
      return;
    }

    // console.log(images);

    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }

    // get user Owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create Fish
    const fish = new Fish({
      name: name,
      age: age,
      description: description,
      weight: weight,
      color: color,
      available: available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      fish.images.push(image.filename);
    });

    try {
      const newFish = await fish.save();
      res.status(201).json({
        message: "Peixe cadastrado com sucesso!",
        newFish: newFish,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // order ASC
  static async getAll(req, res) {
    const fishs = await Fish.find().sort("-createAt");
    res.status(200).json({ fishs: fishs });
  }

  // list User Fishs
  static async getAllUserFishs(req, res) {
    // get User from token
    const token = getToken(req);
    const user = await getUserByToken(token);
    const fishs = await Fish.find({ "user._id": user._id }).sort("-createAt");
    res.status(200).json({
      fishs,
    });
  }

  static async getAllUserAdoptions(req, res) {
    // get User from token
    const token = getToken(req);
    const user = await getUserByToken(token);
    const fishs = await Fish.find({ "adopter._id": user._id }).sort(
      "-createAt"
    );
    res.status(200).json({
      fishs,
    });
  }

  // get Fish by Id
  static async getFishById(req, res) {
    const id = req.params.id;

    // check if Id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id inválido!" });
      return;
    }

    // check if fish exists
    const fish = await Fish.findOne({ _id: id });
    if (!fish) {
      res.status(404).json({ message: "Peixe não Encontrado!" });
    }
    res.status(200).json(fish);
  }

  // remove fish by Id
  static async removeFishById(req, res) {
    const id = req.params.id;

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    // check if Fish exists
    const fish = await Fish.findOne({ _id: id });

    if (!fish) {
      res.status(404).json({ message: "Peixe não encontrado!" });
      return;
    }

    // check if user registered this Fish
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (fish.user._id.toString() != user._id.toString()) {
      res.status(404).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    await Fish.findByIdAndRemove(id);

    res.status(200).json({ message: "Peixe removido com sucesso!" });
  }

  static async updateFish(req, res) {
    const id = req.params.id;
    const { name, age, weight, color, available } = req.body;
    const images = req.files;
    const updateData = {};

    // check if Fish exists
    const fish = await Fish.findOne({ _id: id });
    if (!fish) {
      res.status(404).json({ message: "Peixe não encontrado" });
      return;
    }

    //check if logged in user registered the Fish
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id Fish / id User Owner
    if (fish.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    // validations
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    } else {
      updateData.name = name;
    }

    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    } else {
      updateData.age = age;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório!" });
      return;
    } else {
      updateData.weight = weight;
    }

    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória!" });
      return;
    } else {
      updateData.color = color;
    }

    // console.log(images);

    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    } else {
      updateData.images = [];
      images.map((image) => {
        updateData.images.push(image.filename);
      });
    }

    await Fish.findByIdAndUpdate(id, updateData);

    res
      .status(200)
      .json(
        `Você atualizou o Peixe: id: ${fish._id}; Nome: ${fish.name}, com sucesso! `
      );
  }

  static async schedule(req, res) {
    const id = req.params.id;

    // check if Fish exists
    const fish = await Fish.findOne({ _id: id });
    if (!fish) {
      res.status(404).json({ message: "Peixe não encontrado" });
      return;
    }

    // check if user register the fish
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id fish / id User Owner
    if (fish.user._id.equals(user._id)) {
      res.status(422).json({
        message: `Você não pode agendar uma visita para seu próprio Peixe: ${fish.name}!`,
      });
      return;
    }

    // check if user has already schedule a visit
    if (fish.adopter) {
      if (fish.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: `Você já agendou uma vista para esse Peixe: ${fish.user.name}! Verifique o agendamento com o dono do Peixe, pelo telefone: ${fish.user.phone}`,
        });
        return;
      }
    }

    // add User to fish
    fish.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };
    await Fish.findByIdAndUpdate(id, fish);
    res.status(200).json({
      message: `A visita foi agendada com sucesso, entre em contato com ${fish.user.name}, pelo telefone: ${fish.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id;

    // check if fish exists
    const fish = await Fish.findOne({ _id: id });
    if (!fish) {
      res.status(404).json({ message: "Peixe não encontrado" });
      return;
    }

    //check if logged in user registered the Fish
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id Fish / id User Owner
    if (fish.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    fish.available = false;

    await Fish.findByIdAndUpdate(id, fish);
    res.status(200).json({
      message: `Parabéns o ciclo de adoção foi finalizado com sucesso!`,
    });
  }
};
