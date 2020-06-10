const db = require('./db');

const User = db.sequelize.define('users',{
    user_id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_name: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    user_email: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    user_password: {
        type: db.Sequelize.STRING,
        allowNull: false
    }
});

//User.sync( { force: true } );

module.exports = User;