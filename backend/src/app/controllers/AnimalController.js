import * as Yup from 'yup';
import Animal from '../models/Animal';
import User from '../models/User';
import File from '../models/File';
import Admin from '../models/Admin';

class AnimalController {
  async show(req, res) {
    const { id } = req.params;

    const animal = await Animal.findByPk(id, {
      attributes: ['id', 'name', 'sex', 'type', 'detail', 'photos'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    // await Cache.set('providers', providers);

    return res.json(animal);
  }

  async index(req, res) {
    const { id } = req.params;

    const listAnimals = await Animal.findAll({
      where: {
        institution_id: id,
        situation: false,
      },
      attributes: [
        'id',
        'name',
        'sex',
        'type',
        'detail',
        'institution_id',
        'available',
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(listAnimals);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      sex: Yup.array().required(),
      type: Yup.array().required(),
      detail: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const admin = await Admin.findOne({ where: { user_id: req.userId } });

    if (!admin) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    const { name, sex, type, photos, detail, available } = req.body;

    const institution = admin.institution_id;

    let avatar = 1;

    if (type[0] === 'Cão') {
      avatar = 3;
    }
    if (type[0] === 'Gato') {
      avatar = 4;
    }

    const sexType = sex[0];
    const genreType = type[0];
    const availableType = available[0];

    const newAnimal = await Animal.create({
      name,
      sex: sexType,
      type: genreType,
      photos,
      available: availableType,
      detail,
      user_id: req.userId,
      institution_id: institution,
      avatar_id: avatar,
    });

    return res.json(newAnimal);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      sex: Yup.string(),
      photos: Yup.string(),
      detail: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { id } = req.params;

    const admin = await Admin.findOne({ where: { user_id: req.userId } });

    if (!admin) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }
    const animal = await Animal.findByPk(id);

    if (!(admin.institution_id === animal.institution_id)) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    const { available } = req.body;

    if (available[0] === 'false') {
      animal.available = false;
    }
    if (available[0] === 'true') {
      animal.available = true;
    }

    delete req.body.available;

    await animal.save();
    await animal.update(req.body);

    return res.json(animal);
  }

  async patch(req, res) {
    const { id } = req.params;
    const { animalId } = req.body;
    const animal = await Animal.findByPk(animalId);

    if (!animal) {
      return res.status(401).json('Não permitido');
    }

    const oldFile = await File.findOne({
      where: { id: animal.avatar_id },
    });

    animal.avatar_id = id;

    if (oldFile.id !== 3 && oldFile.id !== 4) {
      await oldFile.destroy();
    }

    await animal.save();

    const responseAvatar = await Animal.findByPk(animal.id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(responseAvatar);
  }

  async delete(req, res) {
    const { id } = req.params;

    const animal = await Animal.findByPk(id);
    if (!animal) {
      return res.status(401).json({ error: 'Animal não encontrado' });
    }

    const isAdmin = await Admin.findOne({ where: { user_id: req.userId } });

    if (!(animal.institution_id === isAdmin.institution_id)) {
      return res
        .status(401)
        .json({ error: 'Somente os administradores podem deletar' });
    }

    await animal.destroy();

    return res.json({ message: 'O registro do animal foi excluido.' });
  }
}

export default new AnimalController();
