import Sequelize, { Model } from 'sequelize';

class Animal extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        sex: Sequelize.STRING,
        type: Sequelize.STRING,
        detail: Sequelize.STRING,
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
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }
}

export default Animal;
