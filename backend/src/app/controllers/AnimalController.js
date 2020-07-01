import Animal from '../models/Animal';
import Admin from '../models/Admin';

class AnimalController {
  async store(req, res) {
    const admin = await Admin.findOne({ where: { user_id: req.userId } });

    if (!admin) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    const { name, sex, type, detail } = req.body;
    const institution = admin.institution_id;

    const newAnimal = await Animal.create({
      name,
      sex,
      type,
      detail,
      user_id: req.userId,
      institution_id: institution,
    });

    return res.json(newAnimal);
  }
}

export default new AnimalController();
