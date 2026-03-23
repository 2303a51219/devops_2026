const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * QUESTION 3 & 4: Relationships and Sequelize Methods
 * 
 * Enrollment demonstrates:
 * - Many-to-Many relationship with Courses through this table
 * - Foreign keys for relational integrity
 * - Sequelize methods: findAll, findByPk, create, update, destroy
 */
const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    validate: {
      isInt: true
    }
  },
  studentName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100]
    }
  },
  studentEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: {
        msg: 'Invalid email format'
      },
      notEmpty: true
    }
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completionStatus: {
    type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
    defaultValue: 'Not Started',
    validate: {
      isIn: {
        args: [['Not Started', 'In Progress', 'Completed']],
        msg: 'Status must be: Not Started, In Progress, or Completed'
      }
    }
  },
  progressPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0,
      max: 100
    }
  },
  certificateObtained: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    { fields: ['courseId'] },
    { fields: ['studentEmail'] },
    { fields: ['courseId', 'studentEmail'], unique: true } // Unique constraint: one student per course
  ]
});

module.exports = Enrollment;
