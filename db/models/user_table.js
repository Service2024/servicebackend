'use strict';
const {
  Model,Sequelize
} = require('sequelize');

const sequelize = require('../../config/database')

module.exports = sequelize.define('user_table',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    unique:true
  },
  phonenumber: {
    type: Sequelize.INTEGER,
    unique:true
  },
  password: {
    type: Sequelize.STRING
  },
  token: {
    type: Sequelize.STRING
  },
  updatetoken:{
    type: Sequelize.STRING
  },
  userType:{
    type:Sequelize.ENUM('0','1','2'),
    defaultValue:'0'
  },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE
  }
},{
  freezeTableName:true,
  modelName:'user_table'
})