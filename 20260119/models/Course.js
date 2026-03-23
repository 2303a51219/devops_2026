const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * QUESTION 2: Data Validation and Constraints
 * 
 * Sequelize handles validation through:
 * 1. Model validators - built-in and custom validation rules
 * 2. Database constraints - NOT NULL, UNIQUE, PRIMARY KEY
 * 3. Data types - enforce type checking at database level
 * 4. Hooks - pre/post validation operations (beforeCreate, afterCreate, etc.)
 */
const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Course title cannot be empty'
      },
      len: {
        args: [3, 255],
        msg: 'Course title must be between 3 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 2000]
    }
  },
  instructor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  duration: {
    type: DataTypes.INTEGER, // in hours
    allowNull: false,
    validate: {
      isInt: true,
      min: 1,
      max: 1000
    }
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    allowNull: false,
    defaultValue: 'Beginner',
    validate: {
      isIn: {
        args: [['Beginner', 'Intermediate', 'Advanced']],
        msg: 'Level must be one of: Beginner, Intermediate, Advanced'
      }
    }
  },
  maxEnrollments: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50,
    validate: {
      isInt: true,
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      isDecimal: true,
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'courses',
  timestamps: true,
  indexes: [
    { fields: ['title'] },
    { fields: ['instructor'] },
    { fields: ['level'] }
  ]
});

module.exports = Course;
