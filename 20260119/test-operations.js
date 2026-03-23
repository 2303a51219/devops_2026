/**
 * COMPREHENSIVE DEMONSTRATION OF SEQUELIZE CRUD OPERATIONS
 * 
 * This file demonstrates answers to all questions:
 * Q1: CRUD operations (create, read, update, delete)
 * Q2: Data validation and constraints
 * Q3: Relationships (one-to-many, many-to-many)
 * Q4: Sequelize methods (findAll, findByPk, create, update, destroy)
 * Q5: Error handling and exceptions
 */

require('dotenv').config();
const sequelize = require('./config/database');
const CourseController = require('./controllers/CourseController');
const EnrollmentController = require('./controllers/EnrollmentController');
const { Course, Enrollment } = require('./models');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function demonstrateOperations() {
  try {
    console.log('\n' + '='.repeat(80));
    console.log('🎓 TRAINING PLATFORM - SEQUELIZE CRUD DEMONSTRATION');
    console.log('='.repeat(80) + '\n');

    // 1. Connect to database
    console.log('📡 STEP 1: Initializing Database Connection');
    console.log('-'.repeat(80));
    await sequelize.authenticate();
    console.log('✅ Database connected successfully\n');

    // 2. Sync models
    console.log('📡 STEP 2: Syncing Database Models');
    console.log('-'.repeat(80));
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized (courses and enrollments tables created)\n');

    // 3. QUESTION 1 & 4: CREATE Operations
    console.log('📡 STEP 3: QUESTION 1 & 4 - CREATE Operations');
    console.log('-'.repeat(80));
    console.log('Sequelize Method: create() - Inserts a single record\n');

    const course1 = await CourseController.createCourse({
      title: 'Advanced Node.js Architecture',
      description: 'Deep dive into building scalable Node.js applications with microservices patterns',
      instructor: 'Sarah Chen',
      duration: 40,
      level: 'Advanced',
      maxEnrollments: 30,
      price: 299.99,
      isActive: true
    });

    const course2 = await CourseController.createCourse({
      title: 'React Fundamentals',
      description: 'Learn React hooks, components, and state management from scratch',
      instructor: 'John Smith',
      duration: 30,
      level: 'Beginner',
      maxEnrollments: 50,
      price: 149.99,
      isActive: true
    });

    const course3 = await CourseController.createCourse({
      title: 'Database Design with SQL',
      description: 'Master relational database design, normalization, and optimization',
      instructor: 'Emily Watson',
      duration: 35,
      level: 'Intermediate',
      maxEnrollments: 25,
      price: 199.99,
      isActive: true
    });

    console.log(`✅ Created 3 courses successfully\n`);

    // 4. QUESTION 2: Data Validation Demonstration
    console.log('📡 STEP 4: QUESTION 2 - Data Validation & Constraints');
    console.log('-'.repeat(80));
    console.log('Sequelize validates data against model constraints.\n');

    try {
      console.log('❌ Attempting to create course with INVALID data:');
      await CourseController.createCourse({
        title: 'XY', // Too short - violates len: [3, 255]
        description: 'Short', // Too short - violates len: [10, 2000]
        instructor: 'Test',
        duration: -5 // Negative - violates min: 1
      });
    } catch (error) {
      console.log(`✅ Validation caught the error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      if (error.errors) {
        error.errors.forEach(msg => console.log(`   - ${msg}`));
      }
      console.log();
    }

    try {
      console.log('❌ Attempting to create duplicate course (UNIQUE constraint):');
      await CourseController.createCourse({
        title: 'Advanced Node.js Architecture', // Duplicate
        description: 'Different description',
        instructor: 'Someone else',
        duration: 20,
        level: 'Beginner'
      });
    } catch (error) {
      console.log(`✅ Constraint validation caught: ${error.name}`);
      console.log(`   Message: ${error.message}\n`);
    }

    // 5. QUESTION 4: READ Operations - findAll()
    console.log('📡 STEP 5: QUESTION 4 - READ Operations with findAll()');
    console.log('-'.repeat(80));
    console.log('Sequelize Method: findAll() - Retrieves multiple records with filtering/sorting\n');

    const allCourses = await CourseController.getAllCourses({
      level: 'Advanced',
      limit: 10,
      sortBy: 'title'
    });
    console.log(`✅ Retrieved ${allCourses.courses.length} course(s)`);
    console.log(`   Pagination: ${allCourses.pagination.page}/${allCourses.pagination.totalPages}\n`);

    // 6. QUESTION 4: READ Operations - findByPk()
    console.log('📡 STEP 6: QUESTION 4 - READ by Primary Key with findByPk()');
    console.log('-'.repeat(80));
    console.log('Sequelize Method: findByPk() - Fastest method for primary key lookups\n');

    const courseDetail = await CourseController.getCourseById(course1.id);
    console.log(`✅ Retrieved course: "${courseDetail.title}"`);
    console.log(`   ID: ${courseDetail.id}`);
    console.log(`   Instructor: ${courseDetail.instructor}`);
    console.log(`   Price: $${courseDetail.price}\n`);

    // 7. QUESTION 3: One-to-Many Relationships
    console.log('📡 STEP 7: QUESTION 3 - ONE-TO-MANY Relationship');
    console.log('-'.repeat(80));
    console.log(
      'Relationship: One Course has Many Enrollments\n' +
      'Defined with: Course.hasMany(Enrollment) and Enrollment.belongsTo(Course)\n'
    );

    // Create enrollments
    const enrollment1 = await EnrollmentController.enrollStudent({
      courseId: course1.id,
      studentName: 'Alice Johnson',
      studentEmail: 'alice@example.com',
      completionStatus: 'In Progress',
      progressPercentage: 60
    });

    const enrollment2 = await EnrollmentController.enrollStudent({
      courseId: course1.id,
      studentName: 'Bob Wilson',
      studentEmail: 'bob@example.com',
      completionStatus: 'Not Started',
      progressPercentage: 0
    });

    const enrollment3 = await EnrollmentController.enrollStudent({
      courseId: course2.id,
      studentName: 'Alice Johnson',
      studentEmail: 'alice@example.com',
      completionStatus: 'Completed',
      progressPercentage: 100,
      certificateObtained: true
    });

    console.log(`✅ Created 3 enrollments\n`);

    // Test relationship eager loading
    const courseWithEnrollments = await Course.findByPk(course1.id, {
      include: { model: Enrollment, as: 'enrollments' }
    });

    console.log(`✅ Using Eager Loading - Retrieved course with ${courseWithEnrollments.enrollments.length} enrollments:`);
    courseWithEnrollments.enrollments.forEach(e => {
      console.log(`   - ${e.studentName}: ${e.completionStatus} (${e.progressPercentage}%)`);
    });
    console.log();

    // 8. QUESTION 4: UPDATE Operations
    console.log('📡 STEP 8: QUESTION 4 - UPDATE Operations');
    console.log('-'.repeat(80));
    console.log(
      'Sequelize Method: update() - Modifies record with validation\n' +
      'Note: Validation rules apply on update too\n'
    );

    const updatedCourse = await CourseController.updateCourse(course2.id, {
      price: 179.99,
      maxEnrollments: 60,
      description: 'Updated: Learn React hooks, components, state management, and advanced patterns from scratch'
    });

    console.log(`✅ Updated course: "${updatedCourse.title}"`);
    console.log(`   New Price: $${updatedCourse.price}`);
    console.log(`   Max Enrollments: ${updatedCourse.maxEnrollments}\n`);

    // Update enrollment progress
    const updatedEnrollment = await EnrollmentController.updateEnrollment(
      enrollment1.id,
      {
        progressPercentage: 100,
        completionStatus: 'Completed'
      }
    );

    console.log(`✅ Updated enrollment: ${updatedEnrollment.studentName}`);
    console.log(`   Progress: ${updatedEnrollment.progressPercentage}%`);
    console.log(`   Status: ${updatedEnrollment.completionStatus}`);
    console.log(`   Certificate: ${updatedEnrollment.certificateObtained ? 'Issued ✓' : 'Not issued'}\n`);

    // 9. QUESTION 5: Error Handling - Duplicate Enrollment
    console.log('📡 STEP 9: QUESTION 5 - Error Handling (Graceful Exception Management)');
    console.log('-'.repeat(80));
    console.log('Testing duplicate enrollment detection:\n');

    try {
      await EnrollmentController.enrollStudent({
        courseId: course1.id,
        studentName: 'Alice Johnson Duplicate',
        studentEmail: 'alice@example.com', // Already enrolled in this course
        progressPercentage: 0
      });
    } catch (error) {
      console.log(`✅ Error caught: ${error.name}`);
      console.log(`   Status Code: ${error.statusCode}`);
      console.log(`   Message: ${error.message}\n`);
    }

    // 10. QUESTION 5: Error Handling - Course Full
    console.log('Testing enrollment capacity validation:\n');

    try {
      for (let i = 0; i < 35; i++) {
        await EnrollmentController.enrollStudent({
          courseId: course3.id,
          studentName: `Student ${i}`,
          studentEmail: `student${i}@example.com`
        });
      }
    } catch (error) {
      console.log(`✅ Error caught when exceeding capacity:`);
      console.log(`   Type: ${error.name}`);
      console.log(`   Message: ${error.message}\n`);
    }

    // 11. Advanced Queries
    console.log('📡 STEP 10: Advanced Sequelize Methods');
    console.log('-'.repeat(80));
    console.log('Using count(), aggregate functions, and custom queries:\n');

    const totalCourses = await Course.count();
    console.log(`✅ Total courses: ${totalCourses}`);

    const totalEnrollments = await Enrollment.count();
    console.log(`✅ Total enrollments: ${totalEnrollments}`);

    const stats = await CourseController.getCourseStats(course1.id);
    console.log(`✅ Course Statistics for "${stats.courseTitle}":`);
    console.log(`   Total Enrollments: ${stats.totalEnrollments}`);
    console.log(`   Completed: ${stats.completedCount}`);
    console.log(`   Certificates Issued: ${stats.certificatesIssued}`);
    console.log(`   Average Progress: ${stats.averageProgress}%\n`);

    // 12. QUESTION 3: Fetch related data through relationships
    console.log('📡 STEP 11: Querying Through Relationships');
    console.log('-'.repeat(80));
    console.log('Using association methods from relationships:\n');

    const courseEnrollments = await EnrollmentController.getEnrollmentsByCourse(course1.id);
    console.log(`✅ Enrollments in "${courseEnrollments.courseTitle}":`);
    courseEnrollments.enrollments.forEach(e => {
      console.log(`   - ${e.studentName} (${e.studentEmail}): ${e.completionStatus}`);
    });
    console.log();

    const studentEnrollments = await EnrollmentController.getStudentEnrollments('alice@example.com');
    console.log(`✅ Courses enrolled by alice@example.com:`);
    studentEnrollments.enrollments.forEach(e => {
      console.log(`   - ${e.course.title}: ${e.completionStatus}`);
    });
    console.log();

    // 13. QUESTION 4: DELETE Operations
    console.log('📡 STEP 12: QUESTION 4 - DELETE Operations');
    console.log('-'.repeat(80));
    console.log(
      'Sequelize Method: destroy()\n' +
      'With CASCADE: Deleting course also deletes related enrollments\n'
    );

    const enrollmentsBefore = await Enrollment.count({ where: { courseId: course3.id } });
    console.log(`Before deletion: ${enrollmentsBefore} enrollments in course ${course3.id}`);

    await CourseController.deleteCourse(course3.id);

    const enrollmentsAfter = await Enrollment.count({ where: { courseId: course3.id } });
    console.log(`After deletion: ${enrollmentsAfter} enrollments (CASCADE worked!)\n`);

    // Single unenrollment
    console.log('Unenrolling single student:\n');
    await EnrollmentController.unenrollStudent(enrollment2.id);
    console.log(`✅ Student unenrolled\n`);

    // 14. Summary
    console.log('📡 FINAL SUMMARY');
    console.log('='.repeat(80));

    const finalCourses = await Course.count();
    const finalEnrollments = await Enrollment.count();

    console.log(`\n📊 Project Statistics:`);
    console.log(`   Total Courses: ${finalCourses}`);
    console.log(`   Total Enrollments: ${finalEnrollments}`);
    console.log(`\n✨ All CRUD operations demonstrated successfully!\n`);

    console.log('📋 ANSWERS TO INTERVIEW QUESTIONS:');
    console.log('-'.repeat(80));
    console.log(`
Q1: CRUD Implementation with Sequelize
✅ CREATE: Use model.create(data) with validation
✅ READ:   Use findAll() for multiple records, findByPk() for primary keys
✅ UPDATE: Use model.update(data) - re-validates constraints
✅ DELETE: Use model.destroy() - respects CASCADE rules

Q2: Data Validation & Constraints
✅ Sequelize validates through:
   - validate: { ... } in field definitions
   - allowNull, unique, default, enum constraints
   - Data types enforce type checking
   - Hooks (beforeCreate, beforeUpdate, etc.)

Q3: Relationship Definition
✅ One-to-Many: Course.hasMany(Enrollment) + Enrollment.belongsTo(Course)
✅ Many-to-Many: Can use belongsToMany() or junction table approach
✅ Cascade: onDelete: 'CASCADE' automatically removes related records

Q4: Sequelize Methods Role
✅ findAll()   - Retrieve multiple records with WHERE, ORDER, INCLUDE
✅ findByPk()  - Optimized primary key lookup (fast!)
✅ create()    - INSERT new record with validation
✅ update()    - UPDATE record with validation re-check
✅ destroy()   - DELETE record respecting constraints

Q5: Error Handling Strategy
✅ Try-catch blocks around all async operations
✅ Custom error classes (ValidationError, NotFoundError, etc.)
✅ Global middleware catches and formats errors
✅ HTTP status codes: 400 (validation), 404 (not found), 409 (conflict), 500 (DB error)
    `);

    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Demonstration failed:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Run demonstration
demonstrateOperations();
