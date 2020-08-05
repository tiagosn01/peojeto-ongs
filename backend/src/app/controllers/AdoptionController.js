import * as Yup from 'yup';
import Adoption from '../models/Adoption';
import Institution from '../models/Institution';
import Animal from '../models/Animal';
import Admin from '../models/Admin';
import User from '../models/User';

class AdoptionController {
  async index(req, res) {
    const { id } = req.params;

    const listAdoptions = await Adoption.findAll({
      where: {
        institution_id: id,
      },
      attributes: [
        'id',
        'name',
        'email',
        'celphone',
        'rg',
        'cpf',
        'voluntary',
        'canceled_at',
        'created_at',
      ],
      include: [
        {
          model: Animal,
          as: 'animal',
          attributes: ['name'],
        },
        {
          model: Institution,
          as: 'institution',
          attributes: ['name'],
        },
      ],
    });

    return res.json(listAdoptions);
  }

  async search(req, res) {
    const { id } = req.params;

    const { rg } = req.body;

    const searchRG = await Adoption.findAll({
      where: {
        institution_id: id,
        rg,
      },
      attributes: [
        'id',
        'name',
        'email',
        'cpf',
        'rg',
        'celphone',
        'voluntary',
        'canceled_at',
        'created_at',
      ],
      include: [
        {
          model: Animal,
          as: 'animal',
          attributes: ['name'],
        },
        {
          model: Institution,
          as: 'institution',
          attributes: ['name'],
        },
      ],
    });

    if (!searchRG) {
      return res.json({ error: 'Nenhuma adoção encontrada' });
    }

    return res.json(searchRG);
  }

  async store(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      cpf: Yup.string(),
      rg: Yup.string(),
      celphone: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const admin = await Admin.findOne({ where: { user_id: req.userId } });

    if (!admin) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    const institution = await Institution.findByPk(admin.institution_id);

    const user = await User.findByPk(req.userId);

    if (!institution || !user) {
      return res
        .status(400)
        .json({ error: 'A instituição ou o usuário não existe.' });
    }

    const { name, email, cpf, rg, celphone } = req.body;
    const animal = await Animal.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!animal || animal.situation === true) {
      return res
        .status(401)
        .json({ error: 'O animal não existe ou ja foi adotado.' });
    }

    animal.situation = true;

    await animal.save();

    const newAdoption = await Adoption.create({
      name,
      email,
      cpf,
      rg,
      celphone,
      voluntary: animal.user.name,
      institution_id: institution.id,
      animal_id: id,
    });

    return res.json(newAdoption);
  }

  async delete(req, res) {
    const { id } = req.params;

    const adoption = await Adoption.findByPk(id);
    if (!adoption) {
      return res.status(401).json({ error: 'Animal não encontrado' });
    }

    const isAdmin = await Admin.findOne({ where: { user_id: req.userId } });

    if (!(adoption.institution_id === isAdmin.institution_id)) {
      return res
        .status(401)
        .json({ error: 'Somente os administradores podem deletar' });
    }

    const animal = await Animal.findByPk(adoption.animal_id);

    animal.situation = false;

    await animal.save();

    adoption.canceled_at = new Date();

    await adoption.save();

    return res.json({ message: 'O registro do animal foi excluido.' });
  }
}

export default new AdoptionController();
