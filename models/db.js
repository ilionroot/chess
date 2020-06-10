const Sequelize = require('sequelize');

const sequelize = new Sequelize('bancola','scolion','maronna2204', {
    host: "mysql669.umbler.com",
    port: 41890,
    dialect: "mysql"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}