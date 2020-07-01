import Institution from '../models/Institution';
import File from '../models/File';

class InstitutionController {
  async store(req, res) {
    const { name, email, street, city, state, detail } = req.body;

    const institutionExists = await Institution.findOne({
      where: { email: req.body.email },
    });

    if (institutionExists) {
      return res.status(400).json({ error: 'Institution already exists.' });
    }

    const newInstitution = await Institution.create({
      name,
      email,
      street,
      city,
      state,
      detail,
      owner_id: req.userId,
    });

    return res.json(newInstitution);
  }

  async update(req, res) {
    const institution = await Institution.findOne({
      where: { owner_id: req.userId },
    });

    if (!institution) {
      return res
        .status(400)
        .json({ error: 'Somenete o criador pode fazer essas alterações.' });
    }

    institution.update(req.body);

    const { id, name, email, avatar } = await Institution.findByPk(
      institution.id,
      {
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'path', 'url'],
          },
        ],
      }
    );

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new InstitutionController();
