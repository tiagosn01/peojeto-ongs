import crypto from 'crypto';
import User from '../models/User';
import Mail from '../../modules/mailer';

class AuthController {
  async update(req, res) {
    const { email } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res
          .status(400)
          .send({ error: 'Erro ao resetar a senha, tente novamente.' });
      }

      const token = crypto.randomBytes(5).toString('hex');

      await user.update({
        password: token,
      });

      await Mail.sendMail({
        to: `${user.name} <${user.email}>`,
        subject: 'Resete de senha',
        template: 'resetPassword',
        context: {
          user: user.name,
          password: token,
        },
        from: 'helppet@gmail.com',
      });

      return res.json({ message: 'Senha resetada com sucesso!' });
    } catch (err) {
      return res
        .status(400)
        .send({ error: 'Erro ao resetar a senha, tente novamente.' });
    }
  }
}

export default new AuthController();
