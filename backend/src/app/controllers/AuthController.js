import crypto from 'crypto';
import User from '../models/User';
import Queue from '../../modules/Queue';

import PasswordMail from '../jobs/PasswordMail';

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

      const token = crypto.randomBytes(6).toString('hex');

      await user.update({
        password: token,
      });

      Queue.add(PasswordMail.key, {
        user,
        token,
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
