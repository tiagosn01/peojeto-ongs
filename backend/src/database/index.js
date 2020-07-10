import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Institution from '../app/models/Institution';
import Admin from '../app/models/Admin';
import Animal from '../app/models/Animal';
import Adoption from '../app/models/Adoption';

import databaseConfig from '../config/database';

const models = [User, File, Institution, Admin, Animal, Adoption];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
