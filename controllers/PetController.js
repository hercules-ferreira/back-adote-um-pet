const Pet = require("../models/Pet");

// helpers
const getUserByToken = require("../helpers/getUserByToken");
const getToken = require("../helpers/getToken");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  // create a pet
  static async create(req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const description = req.body.description;
    const weight = req.body.weight;
    const color = req.body.color;
    const images = req.file;
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

    if (!images) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }

    // get user Owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create pet
    const pet = new Pet({
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
    console.log(images);
    // images.map((image) => {
    // console.log(image);
    pet.images.push(images.path);
    // });

    try {
      const newPet = await pet.save();
      res.status(201).json({
        message: "Pet cadastrado com sucesso!",
        newPet: newPet,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // order ASC
  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createAt");
    res.status(200).json({ pets: pets });
  }

  // list User Pets
  static async getAllUserPets(req, res) {
    // get User from token
    const token = getToken(req);
    const user = await getUserByToken(token);
    const pets = await Pet.find({ "user._id": user._id }).sort("-createAt");
    res.status(200).json({
      pets,
    });
  }

  static async getAllUserAdoptions(req, res) {
    // get User from token
    const token = getToken(req);
    const user = await getUserByToken(token);
    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createAt");
    res.status(200).json({
      pets,
    });
  }

  // get Pet by Id
  static async getPetById(req, res) {
    const id = req.params.id;

    // check if Id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id inválido!" });
      return;
    }

    // check if pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não Encontrado!" });
    }
    res.status(200).json(pet);
  }

  // remove pet by Id
  static async removePetById(req, res) {
    const id = req.params.id;

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    // check if pet exists
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    // check if user registered this pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() != user._id.toString()) {
      res.status(404).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    await Pet.findByIdAndRemove(id);

    res.status(200).json({ message: "Pet removido com sucesso!" });
  }

  static async updatePet(req, res) {
    const id = req.params.id;
    const { name, age, weight, color, available } = req.body;
    const images = req.files;
    const updateData = {};

    // check if Pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    //check if logged in user registered the Pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id Pet / id User Owner
    if (pet.user._id.toString() !== user._id.toString()) {
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

    await Pet.findByIdAndUpdate(id, updateData);

    res
      .status(200)
      .json(
        `Você atualizou o Pet: id: ${pet._id}; Nome: ${pet.name}, com sucesso! `
      );
  }

  static async schedule(req, res) {
    const id = req.params.id;

    // check if Pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    // check if user register the pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id Pet / id User Owner
    if (pet.user._id.equals(user._id)) {
      res.status(422).json({
        message: `Você não pode agendar uma visita para seu próprio Pet: ${pet.name}!`,
      });
      return;
    }

    // check if user has already schedule a visit
    if (pet.adopter) {
      if (pet.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: `Você já agendou uma vista para esse Pet: ${pet.user.name}! Verifique o agendamento com o dono do Pet, pelo telefone: ${pet.user.phone}`,
        });
        return;
      }
    }

    // add User to Pet
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };
    await Pet.findByIdAndUpdate(id, pet);
    res.status(200).json({
      message: `A visita foi agendada com sucesso, entre em contato com ${pet.user.name}, pelo telefone: ${pet.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id;

    // check if Pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado" });
      return;
    }

    //check if logged in user registered the Pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id Pet / id User Owner
    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    pet.available = false;

    await Pet.findByIdAndUpdate(id, pet);
    res.status(200).json({
      message: `Parabéns o ciclo de adoção foi finalizado com sucesso!`,
    });
  }
};
