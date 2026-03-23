# 🎓 SEQUELIZE CRUD OPERATIONS - INTERVIEW ANSWERS & IMPLEMENTATION GUIDE

## 📚 Quick Reference: All 5 Interview Questions Answered

---

## **QUESTION 1: CRUD Operations Implementation**

### Implementation Overview
```javascript
// CREATE
const course = await Course.create({ /* data */ });

// READ (all)
const courses = await Course.findAll({ /* options */ });

// READ (single)
const course = await Course.findByPk(id);

// UPDATE
await course.update({ /* data */ });

// DELETE
await course.destroy();
```

### Key Points:
✅ All methods are async and return promises  
✅ Validation runs automatically before DB operations  
✅ Methods handle relationships and cascading  
✅ Returns JavaScript objects, not raw SQL results  

**See:** `controllers/CourseController.js` - Full CRUD implementation  
**Demo:** `test-operations.js` - Working examples

---

## **QUESTION 2: Data Validation & Constraints**

### Validation Layers:

```javascript
Course = sequelize.define('Course', {
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,              // 🔒 Database constraint
    unique: true,                  // 🔒 Database constraint
    validate: {
      notEmpty: true,              // 🎯 Application validator
      len: [3, 255]                // 🎯 Application validator
    }
  },
  level: {
    type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
    validate: {
      isIn: [['Beginner', 'Intermediate', 'Advanced']]
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 1000
    }
  }
});
```

### Validation Handles:
1. **Type Checking** - DataTypes enforce types
2. **NULL Constraints** - `allowNull: false`
3. **Unique Constraints** - `unique: true`
4. **Range Validators** - `min`, `max`, `len`
5. **Enum Validation** - `isIn`
6. **Format Validation** - `isEmail`, `isInt`, `isDecimal`

### Error Catching:
```javascript
try {
  await Course.create(data);
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    console.log(error.errors); // Array of validation failures
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    console.log(error.fields); // Which field violated unique
  }
}
```

**See:** `models/Course.js` & `models/Enrollment.js` - Full validation setup  
**Learn:** `SEQUELIZE-SQL-TRANSLATION.js` - Validation examples

---

## **QUESTION 3: Relationships Definition**

### One-to-Many Relationship:

```javascript
// ✅ Definition (models/index.js)
Course.hasMany(Enrollment, {
  foreignKey: 'courseId',
  as: 'enrollments',
  onDelete: 'CASCADE'
});

Enrollment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});
```

### Database Schema:
```
Courses Table:
├─ id (PK)
├─ title (UNIQUE)
└─ ...

Enrollments Table:
├─ id (PK)
├─ courseId (FK → courses.id) ◄─────┐
├─ studentEmail (UNIQUE with courseId) │ One-to-Many
├─ progressPercentage                   │
└─ ...                                  │
  └─ Each course can have MANY enrollments
```

### Using Relationships:

**Eager Loading (1 query):**
```javascript
const course = await Course.findByPk(1, {
  include: { model: Enrollment, as: 'enrollments' }
});
// course.enrollments = [enrollment1, enrollment2, ...]
```

**Lazy Loading (2 queries):**
```javascript
const course = await Course.findByPk(1);
const enrollments = await course.getEnrollments();
```

**Association Methods:**
```javascript
await course.getEnrollments();              // Get all
await course.createEnrollment({...});       // Create
await course.countEnrollments();            // Count
await course.hasEnrollment(enrollment);     // Check
```

**Cascade Delete:**
```javascript
// When deleting course:
// Sequelize automatically: DELETE FROM enrollments WHERE courseId = ?
await course.destroy(); // Enrollments deleted!
```

**See:** `models/index.js` - Relationship definitions  
**Learn:** `SEQUELIZE-SQL-TRANSLATION.js` - Relationship patterns

---

## **QUESTION 4: Sequelize Methods & Their Roles**

### Write Methods:

| Method | SQL | Purpose | Returns |
|--------|-----|---------|---------|
| `create(data)` | INSERT | Add new record | Record object |
| `update(data)` | UPDATE | Modify record | Updated object |
| `destroy()` | DELETE | Remove record | Number affected |
| `bulkCreate([])` | INSERT x N | Add many records | Array of records |

### Read Methods:

| Method | SQL | Performance | When to Use |
|--------|-----|-------------|------------|
| `findByPk(id)` | SELECT WHERE id | ⭐⭐⭐⭐⭐ Fastest | Get by PK (ID) |
| `findOne()` | SELECT WHERE ... | ⭐⭐⭐ Medium | Single record |
| `findAll()` | SELECT ... | ⭐⭐ Medium | Multiple records |
| `count()` | COUNT(*) | ⭐⭐⭐⭐ Very fast | Row count |

### Key Method Examples:

```javascript
// findByPk - Direct index lookup (FASTEST)
const course = await Course.findByPk(1);
// SQL: SELECT * FROM courses WHERE id = 1

// findAll - With filtering
const courses = await Course.findAll({
  where: { level: 'Advanced' },
  order: [['title', 'ASC']],
  limit: 10
});
// SQL: SELECT * FROM courses WHERE level = 'Advanced' 
//      ORDER BY title ASC LIMIT 10

// create - Validates then inserts
const course = await Course.create({
  title: 'Node.js',
  duration: 40
});
// Validates first, then: INSERT INTO courses (title, duration, ...)

// update - Re-validates constraint
await course.update({ price: 299.99 });
// Validates constraint, then: UPDATE courses SET price = 299.99 ...

// destroy - Respects CASCADE
await course.destroy();
// If CASCADE: Deletes enrollments first, then course
```

**See:** `controllers/CourseController.js` - All methods used  
**Learn:** `API-EXAMPLES.js` - Real API usage patterns

---

## **QUESTION 5: Error Handling & Graceful Exception Management**

### Custom Error Classes:

```javascript
// utils/errors.js
class ValidationError extends Error {
  constructor(message, errors = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}
```

### Error Handling in Controllers:

```javascript
try {
  // 1. Try operation
  const course = await Course.create(data);
  
} catch (error) {
  // 2. Handle Sequelize validation errors
  if (error.name === 'SequelizeValidationError') {
    throw new ValidationError(
      'Validation failed',
      error.errors.map(e => e.message)
    );
  }
  
  // 3. Handle unique constraint violations
  if (error.name === 'SequelizeUniqueConstraintError') {
    throw new ConflictError('This value already exists');
  }
  
  // 4. Generic database error
  throw new DatabaseError('Operation failed', error);
}
```

### Global Error Middleware:

```javascript
// middleware/errorHandler.js
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'ValidationError',
      details: err.errors
    });
  }
  
  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: 'NotFoundError',
      message: err.message
    });
  }
  
  // ... more handlers
  
  res.status(err.statusCode || 500).json({
    error: err.name,
    message: err.message
  });
});
```

### Error Handling Strategies:

✅ **Validate before database** - catch errors early  
✅ **Check existence** - verify records before operations  
✅ **Use transactions** - atomic multi-step operations  
✅ **Catch all errors** - global error handler  
✅ **Log errors** - for debugging  
✅ **Return appropriate HTTP codes:**
  - 400: Validation failed
  - 404: Not found
  - 409: Conflict (duplicate, capacity)
  - 503: Database unavailable

**See:** `middleware/errorHandler.js` - Full implementation  
**Learn:** `SEQUELIZE-SQL-TRANSLATION.js` - Error scenarios

---

## 📁 File Structure & Purpose

```
├── config/
│   └── database.js              # Sequelize connection setup
│
├── models/
│   ├── Course.js                # Course model (Q2: validation)
│   ├── Enrollment.js            # Enrollment model (Q2: validation)
│   └── index.js                 # Relationships (Q3: one-to-many)
│
├── controllers/
│   ├── CourseController.js      # CRUD operations (Q1, Q4)
│   └── EnrollmentController.js  # Relationship operations (Q3, Q4)
│
├── routes/
│   ├── courseRoutes.js          # API endpoints for courses
│   └── enrollmentRoutes.js      # API endpoints for enrollments
│
├── middleware/
│   └── errorHandler.js          # Error handling (Q5)
│
├── utils/
│   └── errors.js                # Custom error classes (Q5)
│
├── API-EXAMPLES.js              # Real API usage examples
├── SEQUELIZE-SQL-TRANSLATION.js # SQL equivalents (learning)
├── test-operations.js           # Demo of all operations
├── app.js                       # Express app configuration
├── server.js                    # Server entry point
└── README.md                    # Full documentation
```

---

## 🚀 Quick Start

### 1. Install Dependencies:
```bash
npm install
```

### 2. Configure Database (.env):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password123
DB_NAME=training_platform
```

### 3. Run Server:
```bash
npm start
# Server running on http://localhost:3000
```

### 4. Run Demo (Tests all CRUD):
```bash
npm test
# Demonstrates all 5 questions with working examples
```

### 5. Test Endpoints:
```bash
# Create course
curl -X POST http://localhost:3000/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Node.js","description":"...","instructor":"John","duration":40}'

# Get all courses
curl http://localhost:3000/api/courses

# Get single course
curl http://localhost:3000/api/courses/1

# Enroll student
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -d '{"courseId":1,"studentName":"Alice","studentEmail":"alice@example.com"}'
```

---

## 💡 Key Takeaways

### For Question 1 (CRUD):
✅ Use `create()` for INSERT  
✅ Use `findByPk()` for SELECT by ID (fastest)  
✅ Use `findAll()` for filtering  
✅ Use `update()` for modification with validation  
✅ Use `destroy()` for deletion with cascade support  

### For Question 2 (Validation):
✅ Model validators run at application level  
✅ Database constraints enforce at database level  
✅ Always catch `SequelizeValidationError` and `SequelizeUniqueConstraintError`  

### For Question 3 (Relationships):
✅ Define with `hasMany()` and `belongsTo()`  
✅ Use eager loading to prevent N+1 queries  
✅ Cascade deletes remove orphaned records  

### For Question 4 (Methods):
✅ `findByPk()` is fastest for ID lookups  
✅ Check performance differences between methods  
✅ Use appropriate method for the use case  

### For Question 5 (Error Handling):
✅ Create custom error classes  
✅ Catch Sequelize errors specifically  
✅ Use global middleware as safety net  
✅ Return appropriate HTTP status codes  

---

## 📖 Learning Resources

- **README.md** - Complete project documentation
- **API-EXAMPLES.js** - Real-world API usage patterns
- **SEQUELIZE-SQL-TRANSLATION.js** - SQL vs Sequelize comparison
- **test-operations.js** - Working demo of all operations
- Controllers & Models - Actual implementation code

---

**Created:** February 2026  
**For:** DevOps Team Interview Preparation
