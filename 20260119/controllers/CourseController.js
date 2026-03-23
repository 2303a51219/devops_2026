const { Course, Enrollment } = require('../models');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * QUESTION 1 & 4: CRUD Operations and Sequelize Methods
 * 
 * Sequelize Methods Used:
 * - create(): INSERT single record
 * - findAll(): SELECT all records with filtering/sorting
 * - findByPk(): SELECT by primary key (fastest)
 * - findOne(): SELECT first matching record
 * - update(): UPDATE records
 * - destroy(): DELETE records
 * - count(): COUNT total records
 */
class CourseController {
  /**
   * CREATE: Insert new course
   * Question 1: How to implement Create operation
   * Question 2: Data validation automatically triggered
   */
  static async createCourse(courseData) {
    try {
      console.log('🔵 Creating new course:', courseData);

      // Sequelize validates before creation
      const course = await Course.create(courseData);

      console.log('✅ Course created successfully:', course.id);
      return course;
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        throw new ValidationError('Course validation failed', messages);
      }
      // Handle unique constraint violations
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictError(`Course title already exists: ${error.fields.title}`);
      }
      throw new DatabaseError('Failed to create course', error);
    }
  }

  /**
   * READ: Get all courses with filtering
   * Question 4: findAll() retrieves multiple records with options
   */
  static async getAllCourses(options = {}) {
    try {
      console.log('🔵 Fetching all courses...');

      const {
        level = null,
        instructor = null,
        isActive = true,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'DESC'
      } = options;

      // Build WHERE clause dynamically
      const where = {};
      if (level) where.level = level;
      if (instructor) where.instructor = { [Op.like]: `%${instructor}%` };
      if (isActive !== null) where.isActive = isActive;

      const courses = await Course.findAll({
        where,
        offset: (page - 1) * limit,
        limit: limit,
        order: [[sortBy, order]],
        include: {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id', 'studentName', 'completionStatus'],
          required: false
        }
      });

      const total = await Course.count({ where });

      console.log(`✅ Found ${courses.length} courses`);
      return {
        courses,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to fetch courses', error);
    }
  }

  /**
   * READ: Get course by ID
   * Question 4: findByPk() is the fastest method for primary key lookups
   */
  static async getCourseById(courseId) {
    try {
      console.log('🔵 Fetching course by ID:', courseId);

      // findByPk is optimized for primary key queries
      const course = await Course.findByPk(courseId, {
        include: {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['id', 'studentName', 'studentEmail', 'completionStatus', 'progressPercentage'],
          required: false
        }
      });

      if (!course) {
        throw new NotFoundError(`Course with ID ${courseId} not found`);
      }

      console.log('✅ Course retrieved successfully');
      return course;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch course', error);
    }
  }

  /**
   * UPDATE: Modify existing course
   * Question 1: How to implement Update operation
   * Question 2: Validation runs on update too
   */
  static async updateCourse(courseId, updateData) {
    try {
      console.log('🔵 Updating course:', courseId);

      // First, verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new NotFoundError(`Course with ID ${courseId} not found`);
      }

      // Use update() method - validates and updates in DB
      await course.update(updateData);

      console.log('✅ Course updated successfully');
      return course;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        throw new ValidationError('Course validation failed', messages);
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictError('Course title already exists');
      }

      throw new DatabaseError('Failed to update course', error);
    }
  }

  /**
   * DELETE: Remove course
   * Question 1: How to implement Delete operation
   * Question 3: CASCADE deletes related enrollments
   */
  static async deleteCourse(courseId) {
    try {
      console.log('🔵 Deleting course:', courseId);

      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new NotFoundError(`Course with ID ${courseId} not found`);
      }

      // destroy() removes the record
      await course.destroy();

      console.log('✅ Course deleted successfully (cascaded enrollments deleted)');
      return { message: `Course ${courseId} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to delete course', error);
    }
  }

  /**
   * Get course statistics
   * Question 4: Using aggregate methods
   */
  static async getCourseStats(courseId) {
    try {
      console.log('🔵 Fetching course statistics:', courseId);

      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new NotFoundError(`Course with ID ${courseId} not found`);
      }

      const enrollments = await Enrollment.findAll({
        where: { courseId },
        attributes: ['completionStatus', 'certificateObtained', 'progressPercentage']
      });

      const stats = {
        courseId,
        courseTitle: course.title,
        totalEnrollments: enrollments.length,
        enrollmentsAvailable: course.maxEnrollments - enrollments.length,
        completedCount: enrollments.filter(e => e.completionStatus === 'Completed').length,
        certificatesIssued: enrollments.filter(e => e.certificateObtained).length,
        averageProgress: enrollments.length > 0 
          ? (enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / enrollments.length).toFixed(2)
          : 0
      };

      console.log('✅ Statistics retrieved');
      return stats;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch statistics', error);
    }
  }

  /**
   * Bulk operations
   */
  static async bulkCreateCourses(courseDataArray) {
    try {
      console.log('🔵 Creating multiple courses...');
      const courses = await Course.bulkCreate(courseDataArray, {
        validate: true
      });
      console.log(`✅ Created ${courses.length} courses`);
      return courses;
    } catch (error) {
      throw new DatabaseError('Bulk creation failed', error);
    }
  }
}

module.exports = CourseController;
