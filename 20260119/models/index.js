const Course = require('./Course');
const Enrollment = require('./Enrollment');

/**
 * QUESTION 3: Defining Relationships between Models
 * 
 * Relationship Types:
 * 1. One-to-Many: One Course has many Enrollments
 *    - Defined using hasMany() and belongsTo()
 * 
 * 2. Many-to-Many: Many Students enroll in Many Courses
 *    - Can use belongsToMany() for direct relationships
 *    - OR use a junction table (Enrollment) with hasMany/belongsTo
 * 
 * Benefits of relationships:
 * - Automatic foreign key constraints
 * - Easy eager loading with include()
 * - Cascading deletes with onDelete: 'CASCADE'
 * - Built-in association methods
 */

// Define One-to-Many relationship: One Course has many Enrollments
Course.hasMany(Enrollment, {
  foreignKey: 'courseId',
  as: 'enrollments',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Inverse relationship: Each Enrollment belongs to a Course
Enrollment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

module.exports = {
  Course,
  Enrollment
};
