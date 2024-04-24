const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dd', 'root', '', {
    host: "localhost",
    dialect: 'mysql',
});

module.exports = sequelize;