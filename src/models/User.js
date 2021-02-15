const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db/db');

class User extends Model {}

User.init({
    username: {
        type: DataTypes.STRING,
        alowNull: false
    },
    password: {
        type: DataTypes.STRING,
        alowNull: false
    },
    fullname: {
        type: DataTypes.STRING,
        alowNull: false
    },
},{
    sequelize,
    modelName: "users"
})

module.exports = User;