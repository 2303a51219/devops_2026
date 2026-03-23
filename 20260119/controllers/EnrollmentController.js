const { Course, Enrollment } = require('../models');
const { ValidationError, NotFoundError, ConflictError, DatabaseError } = require('../utils/errors');
const { Op } = require('sequelize');

/**
 * Enrollment Controller - Handles student enrollment operations
 * Demonstrates relationship operations and cascading effects
 */
class EnrollmentController {
  /**
   * CREATE: Enroll student in course
   * Question 2: Validation prevents duplicate enrollments
   */
  static async enrollStudent(enrollmentData) {
    try {
      console.log('🔵 Processing student enrollment:', enrollmentData);

      const { courseId, studentEmail } = enrollmentData;

      // Verify course exists
      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new NotFoundError(`Course with ID ${courseId} not found`);
      }

      // Check enrollment capacity
      const enrollmentCount = await Enrollment.count({ where: { courseId } });
      if (enrollmentCount >= course.maxEnrollments) {
        throw new ConflictError(`Course is full. Maximum ${course.maxEnrollments} students allowed`);
      }

      // Check if student already enrolled
      const existingEnrollment = await Enrollment.findOne({
        where: { courseId, studentEmail }
      });
      if (existingEnrollment) {
        throw new ConflictError(`Student ${studentEmail} is already enrolled in this course`);
      }

      // Create enrollment
      const enrollment = await Enrollment.create(enrollmentData);

      console.log('✅ Student enrolled successfully');
      return enrollment;
    } catch (error) {
      if (error instanceof (NotFoundError || ConflictError)) throw error;

      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        throw new ValidationError('Enrollment validation failed', messages);
      }

      throw new DatabaseError('Failed to enroll student', error);
    }
  }

  /**
   * READ: Get all enrollments with filters
   */
  static async getAllEnrollments(options = {}) {
    try {
      console.log('🔵 Fetching all enrollments...');

      const {
        courseId = null,
        status = null,
        page = 1,
        limit = 10
      } = options;

      const where = {};
      if (courseId) where.courseId = courseId;
      if (status) where.completionStatus = status;

      const enrollments = await Enrollment.findAll({
        where,
        offset: (page - 1) * limit,
        limit: limit,
        order: [['enrollmentDate', 'DESC']],
        include: {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'instructor', 'level']
        }
      });

      const total = await Enrollment.count({ where });

      console.log(`✅ Found ${enrollments.length} enrollments`);
      return {
        enrollments,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new DatabaseError('Failed to fetch enrollments', error);
    }
  }

  /**
   * READ: Get enrollment by ID
   * Question 4: findByPk() for primary key lookup
   */
  static async getEnrollmentById(enrollmentId) {
    try {
      console.log('🔵 Fetching enrollment:', enrollmentId);

      const enrollment = await Enrollment.findByPk(enrollmentId, {
        include: {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'instructor', 'duration', 'level', 'price']
        }
      });

      if (!enrollment) {
        throw new NotFoundError(`Enrollment with ID ${enrollmentId} not found`);
      }

      console.log('✅ Enrollment retrieved');
      return enrollment;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch enrollment', error);
    }
  }

  /**
   * UPDATE: Update enrollment progress
   * Question 1: Update operation with validation
   */
  static async updateEnrollment(enrollmentId, updateData) {
    try {
      console.log('🔵 Updating enrollment:', enrollmentId);

      const enrollment = await Enrollment.findByPk(enrollmentId);
      if (!enrollment) {
        throw new NotFoundError(`Enrollment with ID ${enrollmentId} not found`);
      }

      // Update progress
      await enrollment.update(updateData);

      // Auto-grant certificate if 100% complete
      if (updateData.progressPercentage === 100 && !enrollment.certificateObtained) {
        await enrollment.update({
          certificateObtained: true,
          completionStatus: 'Completed'
        });
      }

      console.log('✅ Enrollment updated');
      return enrollment;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        throw new ValidationError('Update validation failed', messages);
      }

      throw new DatabaseError('Failed to update enrollment', error);
    }
  }

  /**
   * DELETE: Unenroll student
   * Question 1: Delete operation
   */
  static async unenrollStudent(enrollmentId) {
    try {
      console.log('🔵 Unenrolling student:', enrollmentId);

      const enrollment = await Enrollment.findByPk(enrollmentId);
      if (!enrollment) {
        throw new NotFoundError(`Enrollment with ID ${enrollmentId} not found`);
      }

      await enrollment.destroy();

      console.log('✅ Student unenrolled successfully');
      return { message: `Enrollment ${enrollmentId} deleted successfully` };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to unenroll student', error);
    }
  }

  /**
   * Get enrollments by course
   * Question 3: One-to-Many relationship in action
   */
  static async getEnrollmentsByCourse(courseId) {
    try {
      console.log('🔵 Fetching enrollments for course:', courseId);

      const course = await Course.findByPk(courseId);
      if (!course) {
        throw new NotFoundError(`Course with ID ${courseId} not found`);
      }

      // Using relationship: course.getEnrollments()
      const enrollments = await course.getEnrollments({
        order: [['enrollmentDate', 'DESC']]
      });

      console.log(`✅ Found ${enrollments.length} enrollments`);
      return {
        courseId,
        courseTitle: course.title,
        totalEnrollments: enrollments.length,
        enrollments
      };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError('Failed to fetch course enrollments', error);
    }
  }

  /**
   * Get student's enrollments
   */
  static async getStudentEnrollments(studentEmail) {
    try {
      console.log('🔵 Fetching enrollments for student:', studentEmail);

      const enrollments = await Enrollment.findAll({
        where: { studentEmail },
        include: {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'instructor', 'level', 'duration']
        },
        order: [['enrollmentDate', 'DESC']]
      });

      console.log(`✅ Found ${enrollments.length} enrollments`);
      return {
        studentEmail,
        enrollments
      };
    } catch (error) {
      throw new DatabaseError('Failed to fetch student enrollments', error);
    }
  }

  /**
   * Bulk unenroll
   */
  static async bulkUnenroll(courseId) {
    try {
      console.log('🔵 Bulk unenrolling all students from course:', courseId);

      const deletedCount = await Enrollment.destroy({
        where: { courseId }
      });

      console.log(`✅ Unenrolled ${deletedCount} students`);
      return { deletedCount };
    } catch (error) {
      throw new DatabaseError('Bulk unenroll failed', error);
    }
  }
}

module.exports = EnrollmentController;
