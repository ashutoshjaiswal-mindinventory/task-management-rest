"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("task", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: Sequelize.literal("uuid_generate_v4()"),
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "pending",
      },
      priority: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: "medium",
      },
      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "project",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      assigned_to: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "user",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("task", ["project_id"]);
    await queryInterface.addIndex("task", ["assigned_to"]);
    await queryInterface.addIndex("task", ["status"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("task");
  },
};
