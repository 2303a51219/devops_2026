/**
 * SEQUELIZE QUERIES vs RAW SQL EQUIVALENTS
 * 
 * Understanding how Sequelize ORM translates to SQL
 * and the benefits of using an ORM
 */

// ============================================================================
// QUESTION 1: CRUD OPERATIONS - SQL vs SEQUELIZE
// ============================================================================

const crudComparison = `
═══════════════════════════════════════════════════════════════════════════════
QUESTION 1: CRUD OPERATIONS WITH SEQUELIZE
═══════════════════════════════════════════════════════════════════════════════

📌 CREATE OPERATION
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE CODE:
  const course = await Course.create({
    title: 'Advanced Node.js',
    description: 'Deep dive into...',
    instructor: 'Sarah Chen',
    duration: 40,
    level: 'Advanced',
    price: 299.99
  });

EQUIVALENT RAW SQL:
  INSERT INTO courses (
    title, description, instructor, duration, level, price, isActive, 
    createdAt, updatedAt
  ) VALUES (
    'Advanced Node.js', 'Deep dive into...', 'Sarah Chen', 40, 'Advanced', 
    299.99, true, NOW(), NOW()
  );

BENEFITS OF SEQUELIZE:
  ✅ Automatic timestamp management (createdAt, updatedAt)
  ✅ Data validation runs BEFORE database call
  ✅ Constraint checking (NOT NULL, UNIQUE, etc.)
  ✅ Returns JavaScript object, not raw result
  ✅ Type safety and IDE autocompletion
  ✅ Database-agnostic (works with MySQL, PostgreSQL, etc.)


📌 READ ALL OPERATION (WITH FILTERS & PAGINATION)
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE CODE:
  const courses = await Course.findAll({
    where: {
      level: 'Advanced',
      isActive: true
    },
    order: [['title', 'ASC']],
    offset: 0,
    limit: 10,
    include: {
      model: Enrollment,
      as: 'enrollments'
    }
  });

EQUIVALENT RAW SQL:
  SELECT 
    c.*,
    e.id, e.studentName, e.completionStatus, e.progressPercentage
  FROM courses c
  LEFT JOIN enrollments e ON c.id = e.courseId
  WHERE c.level = 'Advanced' AND c.isActive = true
  ORDER BY c.title ASC
  LIMIT 10 OFFSET 0;

BENEFITS OF SEQUELIZE:
  ✅ Clean, readable syntax
  ✅ Automatic JOIN construction
  ✅ Easy to add/remove conditions
  ✅ SQL injection protection
  ✅ Relationship handling is explicit


📌 READ ONE BY PK OPERATION
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE CODE (FASTEST):
  const course = await Course.findByPk(1);

EQUIVALENT RAW SQL:
  SELECT * FROM courses WHERE id = 1;

WHY SEQUELIZE findByPk() IS FASTER:
  ✅ Direct index lookup on primary key
  ✅ Database optimizes PK queries
  ✅ O(1) complexity instead of O(log n)
  ✅ Always uses index, no query planner needed

COMPARISON - SAME RESULT, SLOWER:
  const course = await Course.findOne({ where: { id: 1 } });
  // Generates same SQL but goes through generic WHERE clause handler


📌 UPDATE OPERATION
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE CODE:
  const course = await Course.findByPk(1);
  await course.update({
    price: 349.99,
    maxEnrollments: 50
  });

EQUIVALENT RAW SQL:
  UPDATE courses 
  SET price = 349.99, maxEnrollments = 50, updatedAt = NOW()
  WHERE id = 1;

BENEFITS OF SEQUELIZE:
  ✅ Validation runs BEFORE update
  ✅ Automatic updatedAt timestamp
  ✅ Returns updated object with new values
  ✅ Can validate partial vs full updates
  ✅ Hooks can run before/after update


📌 DELETE OPERATION
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE CODE (WITH CASCADE):
  const course = await Course.findByPk(1);
  await course.destroy();

EQUIVALENT RAW SQL (WITH FOREIGN KEYS):
  DELETE FROM courses WHERE id = 1;
  -- Foreign key constraint: onDelete: 'CASCADE'
  -- Automatically deletes: DELETE FROM enrollments WHERE courseId = 1;

SEQUELIZE HANDLES:
  ✅ Automatic cascade deletion
  ✅ Referential integrity checking
  ✅ Transaction support for atomicity
  ✅ Before/after delete hooks


═══════════════════════════════════════════════════════════════════════════════
`;

// ============================================================================
// QUESTION 2: DATA VALIDATION & CONSTRAINTS
// ============================================================================

const validationComparison = `
═══════════════════════════════════════════════════════════════════════════════
QUESTION 2: DATA VALIDATION & CONSTRAINTS
═══════════════════════════════════════════════════════════════════════════════

📌 VALIDATION TYPES
───────────────────────────────────────────────────────────────────────────────

1. MODEL VALIDATORS (Application Level)
   - Run in Node.js before database call
   - Prevent invalid data from reaching database
   - Provide user-friendly error messages

2. DATABASE CONSTRAINTS (Database Level)
   - Run in database server
   - Last line of defense
   - Ensure data integrity even if code bypassed

3. DATA TYPES (Automatic)
   - MySQL ENUM enforces allowed values
   - INTEGER prevents string numbers
   - VARCHAR(255) truncates longer strings


📌 VALIDATION EXAMPLE: COURSE MODEL
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE MODEL:
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,              // DATABASE CONSTRAINT
    unique: true,                  // DATABASE CONSTRAINT
    validate: {                    // APPLICATION VALIDATORS
      notEmpty: true,
      len: [3, 255]
    }
  }

DATABASE SCHEMA CREATED:
  CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL UNIQUE,
    ...
  );

VALIDATION WORKFLOW:
  1. Application receives: { title: '' }
  2. Sequelize runs: notEmpty validator → FAILS
  3. Throws ValidationError BEFORE database call
  4. Error message: "Course title cannot be empty"


📌 CONSTRAINT VIOLATION SCENARIOS
───────────────────────────────────────────────────────────────────────────────

SCENARIO 1: Empty Title
  try {
    await Course.create({ title: '' });
  } catch (error) {
    error.name === 'SequelizeValidationError'
    error.errors[0].message === 'notEmpty violation: title cannot be null'
  }

SCENARIO 2: Duplicate Title
  try {
    await Course.create({ title: 'Advanced Node.js' }); // Already exists
  } catch (error) {
    error.name === 'SequelizeUniqueConstraintError'
    error.fields.title === true
  }

SCENARIO 3: Invalid Enum Value
  try {
    await Course.create({ level: 'Expert' }); // Only Beginner/Intermediate/Advanced
  } catch (error) {
    error.name === 'SequelizeValidationError'
    error.errors[0].message === 'Validation isIn on level failed'
  }

SCENARIO 4: Out of Range
  try {
    await Course.create({ duration: 2000 }); // Max 1000
  } catch (error) {
    error.name === 'SequelizeValidationError'
    error.errors[0].message === 'Validation max on duration failed'
  }


═══════════════════════════════════════════════════════════════════════════════
`;

// ============================================================================
// QUESTION 3: RELATIONSHIPS & ASSOCIATIONS
// ============================================================================

const relationshipComparison = `
═══════════════════════════════════════════════════════════════════════════════
QUESTION 3: RELATIONSHIPS & ASSOCIATIONS
═══════════════════════════════════════════════════════════════════════════════

📌 ONE-TO-MANY RELATIONSHIP
───────────────────────────────────────────────────────────────────────────────

BUSINESS CASE:
  One Course can have MANY Enrollments
  One Enrollment belongs to ONE Course

SEQUELIZE DEFINITION:
  Course.hasMany(Enrollment, {
    foreignKey: 'courseId',
    as: 'enrollments',
    onDelete: 'CASCADE'
  });

  Enrollment.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course'
  });

DATABASE SCHEMA:
  Courses:
  ┌─────────────────────┐
  │ id (PK)  │ title    │
  ├──────────┼──────────┤
  │ 1        │ Node.js  │
  │ 2        │ React    │
  └─────────────────────┘

  Enrollments:
  ┌──────────────────────────────────────┐
  │ id (PK) │ courseId (FK) │ studentName │
  ├─────────┼───────────────┼─────────────┤
  │ 1       │ 1             │ Alice       │
  │ 2       │ 1             │ Bob         │
  │ 3       │ 2             │ Alice       │
  └──────────────────────────────────────┘


USING RELATIONSHIPS:

1. EAGER LOADING - Fetch with relationships in ONE query
  const course = await Course.findByPk(1, {
    include: { model: Enrollment, as: 'enrollments' }
  });

SQL GENERATED:
  SELECT c.* FROM courses c
  WHERE c.id = 1;
  
  SELECT e.* FROM enrollments e
  WHERE e.courseId = 1;
  -- Two queries, but Sequelize combines results in JavaScript

2. LAZY LOADING - Fetch separately (TWO queries)
  const course = await Course.findByPk(1);
  const enrollments = await course.getEnrollments();

3. ASSOCIATION METHODS
  await course.getEnrollments();         // Get all
  await course.getEnrollments({ where: { completionStatus: 'Completed' } });
  await course.createEnrollment({...});   // Add
  await course.countEnrollments();        // Count
  await course.addEnrollment(enrollment); // Associate existing


📌 CASCADE DELETE
───────────────────────────────────────────────────────────────────────────────

SEQUELIZE:
  Course.hasMany(Enrollment, { onDelete: 'CASCADE' });

BEHAVIOR WHEN DELETING COURSE:
  ✅ DELETE FROM enrollments WHERE courseId = 1;
  ✅ DELETE FROM courses WHERE id = 1;
  
  Result: 0 orphaned enrollments!

WITHOUT CASCADE (onDelete: 'RESTRICT'):
  ❌ DELETE FROM courses WHERE id = 1;
  ❌ Error: Cannot delete course with enrollments!


═══════════════════════════════════════════════════════════════════════════════
`;

// ============================================================================
// QUESTION 4: SEQUELIZE METHODS & PERFORMANCE
// ============================================================================

const methodsComparison = `
═══════════════════════════════════════════════════════════════════════════════
QUESTION 4: SEQUELIZE METHODS & THEIR ROLES
═══════════════════════════════════════════════════════════════════════════════

📌 FIND METHODS COMPARISON
───────────────────────────────────────────────────────────────────────────────

METHOD: findByPk(id) - PRIMARY KEY LOOKUP
  Sequelize: await Course.findByPk(1)
  SQL:       SELECT * FROM courses WHERE id = 1 LIMIT 1
  Speed:     ⭐⭐⭐⭐⭐ Fastest (O(1) index lookup)
  Use When:  Getting single record by ID

METHOD: findOne(where) - SINGLE ROW WITH CONDITIONS
  Sequelize: await Course.findOne({ where: { title: 'Node.js' } })
  SQL:       SELECT * FROM courses WHERE title = 'Node.js' LIMIT 1
  Speed:     ⭐⭐⭐ Medium (requires search)
  Use When:  Finding single record by non-PK field

METHOD: findAll(where, limit, offset) - MULTIPLE ROWS
  Sequelize: await Course.findAll({ where: { level: 'Advanced' }, limit: 10 })
  SQL:       SELECT * FROM courses WHERE level = 'Advanced' LIMIT 10
  Speed:     ⭐⭐ Medium (depends on conditions)
  Use When:  Listing/filtering records

METHOD: count(where) - ROW COUNT
  Sequelize: await Course.count({ where: { isActive: true } })
  SQL:       SELECT COUNT(*) FROM courses WHERE isActive = true
  Speed:     ⭐⭐⭐⭐ Very fast (single aggregate)
  Use When:  Getting total count for pagination


📌 CRUD METHODS
───────────────────────────────────────────────────────────────────────────────

METHOD: create(data) - INSERT
  Sequelize: await Course.create({ title: 'Node.js', ... })
  SQL:       INSERT INTO courses (...)
  
  Features:
  ✅ Validates data first
  ✅ Returns new object with ID
  ✅ Triggers hooks (beforeCreate, afterCreate)

METHOD: update(data) - UPDATE
  Sequelize: await course.update({ price: 299.99 })
  SQL:       UPDATE courses SET price = 299.99, updatedAt = NOW() WHERE id = 1
  
  Features:
  ✅ Re-validates data (constraints checked again)
  ✅ Returns updated object
  ✅ Automatic updatedAt timestamp
  ✅ Triggers hooks (beforeUpdate, afterUpdate)

METHOD: destroy() - DELETE
  Sequelize: await course.destroy()
  SQL:       DELETE FROM courses WHERE id = 1
  
  Features:
  ✅ Respects CASCADE rules
  ✅ Triggers hooks (beforeDestroy, afterDestroy)
  ✅ Returns affected count


📌 BULK METHODS
───────────────────────────────────────────────────────────────────────────────

METHOD: bulkCreate(array) - MULTIPLE INSERTS
  Sequelize: 
    await Course.bulkCreate([
      { title: 'Course1', ... },
      { title: 'Course2', ... }
    ], { validate: true })
  
  SQL: Multiple INSERT statements (optimized)

METHOD: bulkUpdate(values, where) - BULK UPDATE
  Sequelize:
    await Course.update(
      { isActive: false },
      { where: { level: 'Beginner' } }
    )
  
  SQL: UPDATE courses SET isActive = false WHERE level = 'Beginner'


═══════════════════════════════════════════════════════════════════════════════
`;

// ============================================================================
// QUESTION 5: ERROR HANDLING
// ============================================================================

const errorHandlingComparison = `
═══════════════════════════════════════════════════════════════════════════════
QUESTION 5: ERROR HANDLING & GRACEFUL EXCEPTION MANAGEMENT
═══════════════════════════════════════════════════════════════════════════════

📌 SEQUELIZE ERROR TYPES
───────────────────────────────────────────────────────────────────────────────

1. SequelizeValidationError
   CAUSE: Model validators failed (notEmpty, len, isEmail, etc.)
   HTTP: 400 Bad Request
   ACTION: Return validation errors to user

2. SequelizeUniqueConstraintError
   CAUSE: Duplicate key (unique constraint violated)
   HTTP: 409 Conflict
   ACTION: Tell user the key already exists

3. SequelizeForeignKeyConstraintError
   CAUSE: Referenced record doesn't exist or cascade prevented
   HTTP: 400 Bad Request OR 409 Conflict
   ACTION: Validate foreign key exists before insert/update

4. SequelizeConnectionError
   CAUSE: Database connection failed or timed out
   HTTP: 503 Service Unavailable
   ACTION: Retry or notify admin

5. SequelizeDatabaseError
   CAUSE: Generic database operation failed
   HTTP: 500 Internal Server Error
   ACTION: Log error, return generic message


📌 ERROR HANDLING EXAMPLE
───────────────────────────────────────────────────────────────────────────────

try {
  const course = await Course.create(userData);
} catch (error) {
  // VALIDATION ERROR
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'ValidationError',
      messages: error.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // UNIQUE CONSTRAINT
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'ConflictError',
      message: \`\${Object.keys(error.fields)[0]} already exists\`
    });
  }

  // FOREIGN KEY
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'ForeignKeyError',
      message: 'Referenced record does not exist'
    });
  }

  // CONNECTION ERROR
  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'DatabaseUnavailable',
      message: 'Database connection failed'
    });
  }

  // UNKNOWN ERROR
  console.error('Unexpected error:', error);
  return res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred'
  });
}


📌 GRACEFUL DEGRADATION STRATEGIES
───────────────────────────────────────────────────────────────────────────────

1. VALIDATION BEFORE DATABASE
   ✅ Check data is valid BEFORE hitting database
   ✅ Catch validation early and cheaply

2. EXISTENCE CHECK BEFORE OPERATIONS
   ✅ Verify course exists before enrolling
   ✅ Prevent foreign key errors

3. CAPACITY CHECK BEFORE ENROLLMENT
   ✅ Check course isn't full
   ✅ Prevent constraint violations

4. TRANSACTIONS FOR MULTI-STEP
   try {
     const t = await sequelize.transaction();
     await course.update({...}, { transaction: t });
     await enrollment.create({...}, { transaction: t });
     await t.commit();
   } catch (error) {
     await t.rollback();
   }

5. RETRY LOGIC FOR TRANSIENT ERRORS
   ✅ Connection timeouts (temporary)
   ✅ Deadlocks (temporary)
   ❌ Validation errors (permanent)


═══════════════════════════════════════════════════════════════════════════════
`;

module.exports = {
  crudComparison,
  validationComparison,
  relationshipComparison,
  methodsComparison,
  errorHandlingComparison
};
