'use strict';
const {
  Model,Sequelize
} = require('sequelize');
const sequelize=require('../../config/database')
module.exports = sequelize.define('address_table',{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  address: {
    type: Sequelize.STRING,
    allowNull:false
  },
  city: {
    type: Sequelize.STRING,
    allowNull:false
  },
  state: {
    type: Sequelize.STRING,
    allowNull:false
  },
  postal_code: {
    type: Sequelize.INTEGER,
    allowNull:false
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull:false,
    references:{
      Model:'UserTable',
      key:'id'
    },
    onUpdate:"CASCADE",
    onDelete:"CASCADE"
  }
},{
  freezeTableName:true,
  modelName:'address_table'
})