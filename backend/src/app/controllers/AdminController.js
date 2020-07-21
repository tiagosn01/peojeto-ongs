import Admin from '../models/Admin';
import User from '../models/User';
import Institution from '../models/Institution';
import File from '../models/File';

class AdminController {
  async show(req, res) {
    const { id } = req.params;

    const admin = await Admin.findOne({
      where: {
        user_id: req.userId,
        institution_id: id,
      },
    });

    if (!admin) {
      return res.json({});
    }

    return res.json(admin);
  }

  async index(req, res) {
    // Validação do owner, para listagem de admins
    const institution = await Institution.findOne({
      where: { owner_id: req.userId },
    });

    if (!institution) {
      return res
        .status(401)
        .json({ error: 'Não autorizado, ou a instituição não existe.' });
    }

    const list = await Admin.findAll({
      where: { institution_id: institution.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(list);
  }

  async store(req, res) {
    const { email } = req.body;
    // Validação do owner
    const institution = await Institution.findOne({
      where: { owner_id: req.userId },
    });

    if (!institution) {
      return res
        .status(401)
        .json({ error: 'Não autorizado, ou a instituição não existe.' });
    }

    // Validação do usuario
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'O usuário não existe.' });
    }

    const adminExist = await Admin.findOne({ where: { user_id: user.id } });

    if (adminExist) {
      return res.status(400).json({ error: 'O admin já existe.' });
    }

    const newAdmin = await Admin.create({
      email,
      user_id: user.id,
      institution_id: institution.id,
    });

    await Admin.findByPk(newAdmin.id, {
      attributes: ['email'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json();
  }

  async delete(req, res) {
    // Validação do owner
    const { id } = req.params;

    const ownerExist = await Institution.findOne({
      where: { owner_id: req.userId },
    });

    if (!ownerExist || id === ownerExist.owner_id) {
      return res
        .status(401)
        .json({ error: 'Não autorizado, ou a instituição não existe.' });
    }

    const admin = await Admin.findByPk(id);

    await admin.destroy();

    return res.json({ Sucess: 'Admin excluido com sucesso!' });
  }
}

export default new AdminController();
