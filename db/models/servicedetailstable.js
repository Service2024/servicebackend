'use strict';
const {
  Model,Sequelize
} = require('sequelize');
const sequelize=require('../../config/database')
module.exports = sequelize.define("serviceDetailstable",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  serviceName: {
    allowNull:false,
    type: Sequelize.STRING
  },
  minPrice: {
    allowNull:false,
    type: Sequelize.INTEGER
  },
  maxPrice: {
    allowNull:false,
    type: Sequelize.INTEGER
  },
  serviceDescription: {
    allowNull:false,
    type: Sequelize.STRING
  },
  aboutuserDescription: {
    allowNull:false,
    type: Sequelize.STRING
  },
  diffServices: {
    allowNull:false,
    type: Sequelize.STRING
  },
  qualification: {
    allowNull:false,
    type: Sequelize.STRING
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull:false,
    references:{
      Model:'user_table',
      key:'id'
    },
    onUpdate:"CASCADE",
    onDelete:"CASCADE"
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
  modelName:"serviceDetailstable"
})