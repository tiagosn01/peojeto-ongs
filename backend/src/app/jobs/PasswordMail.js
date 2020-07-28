import Mail from '../../modules/Mailer';

class PasswordMail {
  get key() {
    return 'PasswordMail';
  }

  async handle({ data }) {
    const { user, token } = data;

    await Mail.sendMail({
      to: `${user.name} <${user.email}>`,
      subject: 'Resete de senha',
      template: 'resetPassword',
      context: {
        user: user.name,
        password: token,
      },
      from: 'noreply@helppet.com',
    });
  }
}

export default new PasswordMail();
