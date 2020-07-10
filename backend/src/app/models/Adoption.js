import Sequelize, { Model } from 'sequelize';

class Adoption extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        cpf: Sequelize.STRING,
        voluntary: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Institution, {
      foreignKey: 'institution_id',
      as: 'institution',
    });
    this.belongsTo(models.Animal, {
      foreignKey: 'animal_id',
      as: 'animal',
    });
  }
}

export default Adoption;
