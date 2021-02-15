//DB Config
const keys = require('./keys');
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize (
    keys.database,
    keys.user,
    keys.password, {
        host: keys.host,
        dialect: "mysql",
        define: {
            timestamps: false
        }
    }
)

module.exports = sequelize;