# Training Platform Backend - Sequelize CRUD Operations

A comprehensive demonstration of building an online training platform backend using Sequelize ORM with Node.js and Express. This project answers all key interview questions about CRUD operations, data validation, relationships, and error handling.

## 📋 Project Overview

This backend manages **Courses** and **Student Enrollments** with:
- ✅ Full CRUD operations using Sequelize methods
- ✅ Data validation and constraint enforcement
- ✅ One-to-Many relationship (Course → Enrollments)
- ✅ Graceful error handling and custom exceptions
- ✅ Cascading deletes with referential integrity

## 🎯 Interview Questions Answered

### Q1: CRUD Operations Implementation

**CREATE:**
```javascript
// Using Sequelize create() method
const course = await Course.create({
  title: 'Advanced Node.js',
  description: 'Deep dive into scalable architectures',
  instructor: 'Sarah Chen',
  duration: 40,
  level: 'Advanced'
});
```

**READ (Multiple):**
```javascript
// Using findAll() with filtering and pagination
const courses = await Course.findAll({
  where: { level: 'Advanced' },
  order: [['createdAt', 'DESC']],
  offset: 0,
  limit: 10
});
```

**READ (Single):**
```javascript
// Using findByPk() - fastest for primary keys
const course = await Course.findByPk(1, {
  include: { model: Enrollment, as: 'enrollments' }
});
```

**UPDATE:**
```javascript
// Validates data before updating
await course.update({
  price: 299.99,
  maxEnrollments: 50
});
```

**DELETE:**
```javascript
// Respects CASCADE rules
await course.destroy(); // Deletes related enrollments
```

---

### Q2: Data Validation & Constraints

Sequelize handles validation through:

#### **Model-Level Validators:**
```javascript
const Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,              // NOT NULL constraint
    unique: true,                  // UNIQUE constraint
    validate: {
      notEmpty: { msg: 'Title cannot be empty' },
      len: { args: [3, 255], msg: 'Must be 3-255 characters' }
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
      min: 1,
      max: 1000
    }
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    validate: {
      isIn: {
        args: [['Beginner', 'Intermediate', 'Advanced']],
        msg: 'Invalid level'
      }
    }
  }
});
```

#### **Constraint Types:**
1. **Type Constraints:** DataTypes enforce type checking
2. **NOT NULL:** `allowNull: false`
3. **UNIQUE:** `unique: true`
4. **ENUM:** `DataTypes.ENUM(...values)`
5. **Range Validators:** `min`, `max`, `len`
6. **Custom Validators:** `validate: { customValidator }` function

#### **Error Handling:**
```javascript
try {
  await Course.create({ title: 'XY' }); // Too short
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    error.errors; // Array of validation errors
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    // Handle duplicate key
  }
}
```

---

### Q3: Relationships Definition

#### **One-to-Many Relationship:**
```javascript
// One Course has Many Enrollments
Course.hasMany(Enrollment, {
  foreignKey: 'courseId',
  as: 'enrollments',
  onDelete: 'CASCADE',      // Delete enrollments when course deleted
  onUpdate: 'CASCADE'
});

// Inverse: Each Enrollment belongs to one Course
Enrollment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
```

#### **Using Relationships:**
```javascript
// Eager loading - fetch course with enrollments
const course = await Course.findByPk(1, {
  include: { model: Enrollment, as: 'enrollments' }
});

// Association methods
const enrollments = await course.getEnrollments();
const newEnrollment = await course.createEnrollment({ ... });
const count = await course.countEnrollments();

// Lazy loading
const course = await Course.findByPk(1);
const enrollments = await course.getEnrollments(); // Separate query
```

#### **Many-to-Many Alternative:**
For direct many-to-many (Students ↔ Courses), use:
```javascript
Student.belongsToMany(Course, { through: 'StudentCourse' });
Course.belongsToMany(Student, { through: 'StudentCourse' });
```

---

### Q4: Sequelize Methods Role

| Method | Purpose | Syntax | Performance |
|--------|---------|--------|-------------|
| **create()** | INSERT single record | `Model.create({...})` | O(1) insertion |
| **findAll()** | SELECT multiple records | `Model.findAll({ where: {...} })` | JOIN complexity |
| **findByPk()** | SELECT by ID (fastest) | `Model.findByPk(id)` | Index lookup |
| **findOne()** | SELECT first match | `Model.findOne({ where: {...} })` | First match only |
| **update()** | UPDATE record | `instance.update({...})` | Re-validates data |
| **destroy()** | DELETE record | `instance.destroy()` | CASCADE respected |
| **count()** | COUNT records | `Model.count({ where: {...} })` | Optimized COUNT |
| **bulkCreate()** | INSERT multiple | `Model.bulkCreate([...])` | Batch operation |

#### **Key Differences:**

**findByPk vs findOne:**
```javascript
await Course.findByPk(5);           // Direct index lookup - FAST
await Course.findOne({ where: { id: 5 } }); // WHERE clause - slower
```

**update() vs direct SQL:**
```javascript
await course.update({ price: 299 }); // Validates + updates
// vs direct: UPDATE courses SET price = 299 WHERE id = 1;
```

---

### Q5: Error Handling & Graceful Exceptions

#### **Custom Error Classes:**
```javascript
class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.statusCode = 400;
    this.errors = errors;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
```

#### **Try-Catch with Sequelize Errors:**
```javascript
try {
  await CourseController.createCourse(data);
} catch (error) {
  // Handle validation errors
  if (error.name === 'SequelizeValidationError') {
    console.log(error.errors); // Array of validation failures
  }
  
  // Handle unique constraint violations
  if (error.name === 'SequelizeUniqueConstraintError') {
    console.log(error.fields); // Which field violated unique
  }
  
  // Handle foreign key violations
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    console.log(error.message);
  }
  
  // Handle connection errors
  if (error.name === 'SequelizeConnectionError') {
    console.log('Database unavailable');
  }
}
```

#### **Global Error Middleware:**
```javascript
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'ValidationError',
      messages: err.errors
    });
  }
  
  // More handlers...
  
  res.status(err.statusCode || 500).json({
    error: err.name,
    message: err.message
  });
});
```

---

## 📁 Project Structure

```
training-platform-backend/
├── config/
│   └── database.js                 # Sequelize configuration
├── models/
│   ├── Course.js                   # Course model with validation
│   ├── Enrollment.js               # Enrollment model
│   └── index.js                    # Model relationships
├── controllers/
│   ├── CourseController.js         # Course CRUD logic
│   └── EnrollmentController.js     # Enrollment CRUD logic
├── routes/
│   ├── courseRoutes.js             # Course API routes
│   └── enrollmentRoutes.js         # Enrollment API routes
├── middleware/
│   └── errorHandler.js             # Global error handling
├── utils/
│   └── errors.js                   # Custom error classes
├── app.js                          # Express app setup
├── server.js                       # Server entry point
├── test-operations.js              # Demo & tests
├── package.json
├── .env                            # Environment variables
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites:**
- Node.js 14+
- MySQL 5.7+ or MariaDB

### **Installation:**

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables in `.env`:**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=training_platform
PORT=3000
NODE_ENV=development
```

3. **Start the server:**
```bash
npm start
```

4. **Run demonstration (tests all CRUD operations):**
```bash
npm test
```

---

## 📚 API Endpoints

### **Courses**

```
POST   /api/courses              # Create course
GET    /api/courses              # List all courses (with filters)
GET    /api/courses/:id          # Get course details
PUT    /api/courses/:id          # Update course
DELETE /api/courses/:id          # Delete course (cascades)
GET    /api/courses/:id/stats    # Course statistics
POST   /api/courses/bulk         # Bulk create courses
```

### **Enrollments**

```
POST   /api/enrollments              # Enroll student
GET    /api/enrollments              # List all enrollments
GET    /api/enrollments/:id          # Get enrollment details
PUT    /api/enrollments/:id          # Update enrollment progress
DELETE /api/enrollments/:id          # Unenroll student
GET    /api/enrollments/course/:id   # Enrollments in course
GET    /api/enrollments/student/:email # Student's courses
```

---

## 📝 Example Usage

### **Create a Course:**
```bash
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Advanced Node.js",
    "description": "Master scalable backend development",
    "instructor": "John Doe",
    "duration": 40,
    "level": "Advanced",
    "maxEnrollments": 30,
    "price": 299.99
  }'
```

### **Enroll Student:**
```bash
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1,
    "studentName": "Alice Johnson",
    "studentEmail": "alice@example.com"
  }'
```

### **Update Enrollment Progress:**
```bash
curl -X PUT http://localhost:3000/api/enrollments/1 \
  -H "Content-Type: application/json" \
  -d '{
    "progressPercentage": 85,
    "completionStatus": "In Progress"
  }'
```

---

## 🔍 Key Concepts Demonstrated

### **Eager vs Lazy Loading:**
```javascript
// EAGER LOADING - fetch data in one query
const course = await Course.findByPk(1, {
  include: { model: Enrollment, as: 'enrollments' }
});

// LAZY LOADING - fetch relationships separately
const course = await Course.findByPk(1);
const enrollments = await course.getEnrollments();
```

### **Cascade Operations:**
```javascript
// When course is deleted, all enrollments are automatically deleted
Course.hasMany(Enrollment, { onDelete: 'CASCADE' });
```

### **Transactions:**
```javascript
const transaction = await sequelize.transaction();
try {
  await course.update({...}, { transaction });
  await enrollment.update({...}, { transaction });
  await transaction.commit();
} catch (error) {
  await transaction.rollback();
}
```

---

## 🛡️ Error Handling Strategy

The application uses a layered error handling approach:

1. **Controller Layer:** Catch Sequelize errors, throw custom errors
2. **Route Handler:** Wrap async handlers with `asyncHandler()`
3. **Global Middleware:** Catch all errors, format responses

This ensures:
- ✅ Consistent error responses
- ✅ Appropriate HTTP status codes
- ✅ Detailed error messages for debugging
- ✅ Protection against database errors leaking to client

---

## 📖 Additional Resources

- [Sequelize Documentation](https://sequelize.org)
- [Model Basics](https://sequelize.org/docs/v6/core-concepts/model-basics/)
- [Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [Validations & Constraints](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/)

---

## 💡 Best Practices Implemented

✅ Always validate user input before database operations  
✅ Use transactions for multi-step operations  
✅ Implement error boundaries with try-catch  
✅ Use eager loading to reduce N+1 queries  
✅ Set appropriate foreign key constraints  
✅ Use database indexes on frequently queried columns  
✅ Handle cascade operations carefully  
✅ Log errors for debugging  
✅ Use environment variables for config  
✅ Version your APIs  

---

## 📄 License

MIT

---

**Made with ❤️ for the DevOps Team | 2026**
