'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_table', {
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
      createdat: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedat: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_table');
  }
};