module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'projeto_ongs',
  define: {
    timestamps: true,
    underscored: true,
    undersoredAll: true,
  },
};
