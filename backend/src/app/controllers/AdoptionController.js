import * as Yup from 'yup';
import Adoption from '../models/Adoption';
import Institution from '../models/Institution';
import Animal from '../models/Animal';
import Admin from '../models/Admin';
import User from '../models/User';

class AdoptionController {
  async store(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      cpf: Yup.string().required().min(2),
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

    const { name, email, cpf } = req.body;
    const animal = await Animal.findByPk(id);

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
      voluntary: user.name,
      institution_id: institution.id,
      animal_id: id,
    });

    return res.json(newAdoption);
  }
}

export default new AdoptionController();
