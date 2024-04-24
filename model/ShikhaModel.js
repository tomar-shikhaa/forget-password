const {DataTypes} = require ('sequelize')
const sequelization = require('../config/mysql')
const User = sequelization.define('users',{
    // id:{
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     primaryKey: true,
    //     autoIncrement: true,
    // },
    UserName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    Password:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})
module.exports= User;
