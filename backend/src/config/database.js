module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'helppet',
  define: {
    timestamps: true,
    underscored: true,
    undersoredAll: true,
  },
};
