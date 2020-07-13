import Sequelize, { Model } from 'sequelize';

class Admin extends Model {
  static init(sequelize) {
    super.init(
      {
        email: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Institution, {
      foreignKey: 'institution_id',
      as: 'institution',
    });
  }
}

export default Admin;
