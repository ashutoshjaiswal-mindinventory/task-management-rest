"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.Project, {
        foreignKey: "project_id",
        as: "project",
      });
      Task.belongsTo(models.User, {
        foreignKey: "assigned_to",
        as: "assignee",
      });
    }
  }

  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "in_progress", "completed"]],
        },
      },
      priority: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "medium",
        validate: {
          isIn: [["low", "medium", "high"]],
        },
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      assigned_to: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "task",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return Task;
};
