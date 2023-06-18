const Bird = require("../models/Bird");

// helpers
const getUserByToken = require("../helpers/getUserByToken");
const getToken = require("../helpers/getToken");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class BirdController {
  // create a Bird
  static async create(req, res) {
    const name = req.body.name;
    const age = req.body.age;
    const description = req.body.description;
    const weight = req.body.weight;
    const color = req.body.color;
    const images = req.file;
    const available = true;
    // console.log(req.file);

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

    // if (images) {
    //   res.status(422).json({ message: "A imagem é obrigatória!" });
    //   return;
    // }

    // get user Owner
    const token = getToken(req);
    const user = await getUserByToken(token);

    // create bird
    const bird = new Bird({
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
    bird.images.push(images.path);
    // });

    // console.log(images);
    // images.map((image) => {
    // console.log(image);
    // bird.images.push(images.filename);
    // });

    try {
      const newBird = await bird.save();
      res.status(201).json({
        message: "Pássaro cadastrado com sucesso!",
        newBird: newBird,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  // order ASC
  static async getAll(req, res) {
    const birds = await Bird.find().sort("-createAt");
    res.status(200).json({ birds: birds });
  }

  // list User birds
  static async getAllUserBirds(req, res) {
    // get User from token
    const token = getToken(req);
    const user = await getUserByToken(token);
    const birds = await Bird.find({ "user._id": user._id }).sort("-createAt");
    res.status(200).json({
      birds,
    });
  }

  static async getAllUserAdoptions(req, res) {
    // get User from token
    const token = getToken(req);
    const user = await getUserByToken(token);
    const birds = await Bird.find({ "adopter._id": user._id }).sort(
      "-createAt"
    );
    res.status(200).json({
      birds,
    });
  }

  // get Pássaro by Id
  static async getBirdById(req, res) {
    const id = req.params.id;

    // check if Id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "Id inválido!" });
      return;
    }

    // check if bird exists
    const bird = await Bird.findOne({ _id: id });
    if (!bird) {
      res.status(404).json({ message: "Pássaro não Encontrado!" });
    }
    res.status(200).json(bird);
  }

  // remove bird by Id
  static async removeBirdById(req, res) {
    const id = req.params.id;

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    // check if Bird exists
    const bird = await Bird.findOne({ _id: id });

    if (!bird) {
      res.status(404).json({ message: "Pássaro não encontrado!" });
      return;
    }

    // check if user registered this bird
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (bird.user._id.toString() != user._id.toString()) {
      res.status(404).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    await Bird.findByIdAndRemove(id);

    res.status(200).json({ message: "Pássaro removido com sucesso!" });
  }

  static async updateBird(req, res) {
    const id = req.params.id;
    const { name, age, weight, color, available } = req.body;
    const images = req.files;
    const updateData = {};

    // check if bird exists
    const bird = await Bird.findOne({ _id: id });
    if (!bird) {
      res.status(404).json({ message: "Pássaro não encontrado" });
      return;
      Pássaro;
    }

    //check if logged in user registered the bird
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id bird / id User Owner
    if (bird.user._id.toString() !== user._id.toString()) {
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

    if (images) {
      // res.status(422).json({ message: "A imagem é obrigatória!" });
      // return;
    } else {
      updateData.images = [];
      images.map((image) => {
        updateData.images.push(image.filename);
      });
    }

    await Bird.findByIdAndUpdate(id, updateData);

    res
      .status(200)
      .json(
        `Você atualizou o Pássaro: id: ${bird._id}; Nome: ${bird.name}, com sucesso! `
      );
  }

  static async schedule(req, res) {
    const id = req.params.id;

    // check if bird exists
    const bird = await Bird.findOne({ _id: id });
    if (!bird) {
      res.status(404).json({ message: "Pássaro não encontrado" });
      return;
    }

    // check if user register the bird
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id bird / id User Owner
    if (bird.user._id.equals(user._id)) {
      res.status(422).json({
        message: `Você não pode agendar uma visita para seu próprio Pássaro: ${bird.name}!`,
      });
      return;
    }

    // check if user has already schedule a visit
    if (bird.adopter) {
      if (bird.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: `Você já agendou uma vista para esse Pássaro: ${bird.user.name}! Verifique o agendamento com o dono do Pássaro, pelo telefone: ${bird.user.phone}`,
        });
        return;
      }
    }

    // add User to Bird
    bird.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };
    await Bird.findByIdAndUpdate(id, bird);
    res.status(200).json({
      message: `A visita foi agendada com sucesso, entre em contato com ${bird.user.name}, pelo telefone: ${bird.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    const id = req.params.id;

    // check if bird exists
    const bird = await Bird.findOne({ _id: id });
    if (!bird) {
      res.status(404).json({ message: "Pássaro não encontrado" });
      return;
    }

    //check if logged in user registered the bird
    const token = getToken(req);
    const user = await getUserByToken(token);

    // id to string / compare id bird / id User Owner
    if (bird.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema em processar a sua solicitação, tente novamente mais tarde!",
      });
      return;
    }

    bird.available = false;

    await Bird.findByIdAndUpdate(id, bird);
    res.status(200).json({
      message: `Parabéns o ciclo de adoção foi finalizado com sucesso!`,
    });
  }
};
