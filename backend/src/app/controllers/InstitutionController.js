import * as Yup from 'yup';
import Institution from '../models/Institution';
import File from '../models/File';

class InstitutionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      detail: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }
    const { name, email, street, city, state, detail } = req.body;

    const institutionExists = await Institution.findOne({
      where: { email: req.body.email },
    });

    if (institutionExists) {
      return res.status(400).json({ error: 'Esta instituição ja existe.' });
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

    // Criação do owner como admin( a resolver)

    return res.json(newInstitution);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      street: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      detail: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const institution = await Institution.findOne({
      where: { owner_id: req.userId },
    });

    if (!institution) {
      return res.status(401).json({
        error: 'Somente o criado pode fazer alterações.',
      });
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

  async delete(req, res) {
    const { id } = req.params;

    const institution = await Institution.findByPk(id);
    if (!institution) {
      return res.status(401).json({ error: 'Somente o criador pode deletar' });
    }

    if (!(institution.owner_id === req.userId)) {
      return res.status(401).json({ error: 'Somente o criador pode deletar' });
    }

    await institution.destroy();

    return res.json({ message: 'A instituição foi excluída' });
  }
}

export default new InstitutionController();
