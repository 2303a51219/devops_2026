/**
 * API EXAMPLES AND USE CASES
 * 
 * Comprehensive examples showing how to use each API endpoint
 * with real-world scenarios
 */

// ============================================================================
// COURSE API EXAMPLES
// ============================================================================

/**
 * 1. CREATE A NEW COURSE (POST /api/courses)
 * 
 * Question 1: How to implement Create operation
 * - Validates all fields according to model rules
 * - Automatically adds timestamps (createdAt, updatedAt)
 * - Checks unique constraint on title
 */
const createCourseExample = {
  endpoint: 'POST /api/courses',
  description: 'Create a new training course',
  request: {
    headers: { 'Content-Type': 'application/json' },
    body: {
      title: 'Microservices Architecture with Node.js',
      description: 'Learn to build scalable microservices using Node.js, Docker, and Kubernetes. Covers design patterns, service discovery, and distributed system concepts.',
      instructor: 'Dr. Sarah Chen',
      duration: 48,          // hours
      level: 'Advanced',     // Beginner | Intermediate | Advanced
      maxEnrollments: 25,
      price: 399.99,
      isActive: true
    }
  },
  successResponse: {
    statusCode: 201,
    body: {
      success: true,
      message: 'Course created successfully',
      data: {
        id: 1,
        title: 'Microservices Architecture with Node.js',
        description: '...',
        instructor: 'Dr. Sarah Chen',
        duration: 48,
        level: 'Advanced',
        maxEnrollments: 25,
        price: '399.99',
        isActive: true,
        createdAt: '2026-02-13T10:30:00.000Z',
        updatedAt: '2026-02-13T10:30:00.000Z'
      }
    }
  },
  errorResponse: {
    statusCode: 400,
    body: {
      success: false,
      error: 'ValidationError',
      message: 'Course validation failed',
      details: [
        'Course title must be between 3 and 255 characters',
        'Course description must be between 10 and 2000 characters'
      ]
    }
  }
};

/**
 * 2. READ ALL COURSES (GET /api/courses)
 * 
 * Question 4: findAll() with filtering, sorting, and pagination
 * - Supports filtering by level, instructor
 * - Supports pagination with limit and offset
 * - Includes related enrollments with eager loading
 */
const getAllCoursesExample = {
  endpoint: 'GET /api/courses',
  description: 'Retrieve all courses with filters and pagination',
  queryParameters: {
    level: 'Advanced',           // optional: filter by level
    instructor: 'Sarah',         // optional: search instructor name
    isActive: true,              // optional: filter by status
    page: 1,                     // optional: page number (default: 1)
    limit: 10,                   // optional: courses per page (default: 10)
    sortBy: 'title',             // optional: field to sort by
    order: 'ASC'                 // optional: ASC | DESC
  },
  exampleUrl: 'GET /api/courses?level=Advanced&limit=5&page=1&order=DESC',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Courses retrieved successfully',
      data: {
        courses: [
          {
            id: 1,
            title: 'Advanced Node.js',
            instructor: 'Sarah Chen',
            level: 'Advanced',
            duration: 40,
            price: '299.99',
            maxEnrollments: 30,
            enrollments: [
              { id: 1, studentName: 'Alice', completionStatus: 'Completed' },
              { id: 2, studentName: 'Bob', completionStatus: 'In Progress' }
            ]
          }
        ],
        pagination: {
          total: 5,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }
    }
  }
};

/**
 * 3. READ SINGLE COURSE (GET /api/courses/:id)
 * 
 * Question 4: findByPk() is the fastest method for ID lookups
 * - Direct index lookup on primary key
 * - Includes all related enrollments
 */
const getCourseByIdExample = {
  endpoint: 'GET /api/courses/:id',
  description: 'Get detailed information about a specific course',
  parameters: {
    id: 1
  },
  exampleUrl: 'GET /api/courses/1',
  performanceNote: 'Uses findByPk() - O(1) index lookup, very fast',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Course retrieved successfully',
      data: {
        id: 1,
        title: 'Advanced Node.js Architecture',
        description: 'Deep dive into...',
        instructor: 'Sarah Chen',
        duration: 40,
        level: 'Advanced',
        maxEnrollments: 30,
        price: '299.99',
        isActive: true,
        createdAt: '2026-02-13T08:00:00.000Z',
        updatedAt: '2026-02-13T10:30:00.000Z',
        enrollments: [
          {
            id: 1,
            studentName: 'Alice Johnson',
            studentEmail: 'alice@example.com',
            completionStatus: 'In Progress',
            progressPercentage: 65,
            certificateObtained: false,
            enrollmentDate: '2026-02-01T09:00:00.000Z'
          },
          {
            id: 2,
            studentName: 'Bob Wilson',
            studentEmail: 'bob@example.com',
            completionStatus: 'Completed',
            progressPercentage: 100,
            certificateObtained: true,
            enrollmentDate: '2026-01-15T09:00:00.000Z'
          }
        ]
      }
    }
  },
  errorResponse: {
    statusCode: 404,
    body: {
      success: false,
      error: 'NotFoundError',
      message: 'Course with ID 999 not found'
    }
  }
};

/**
 * 4. UPDATE COURSE (PUT /api/courses/:id)
 * 
 * Question 1: How to implement Update operation
 * Question 2: Validation runs again on update
 * - All constraints are re-checked
 * - Only provided fields are updated (partial updates supported)
 */
const updateCourseExample = {
  endpoint: 'PUT /api/courses/:id',
  description: 'Update course details',
  parameters: {
    id: 1
  },
  request: {
    body: {
      price: 349.99,
      maxEnrollments: 35,
      description: 'Updated description with new content...',
      isActive: true
    }
  },
  validationNote: 'All field validators run again on update',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Course updated successfully',
      data: {
        id: 1,
        title: 'Advanced Node.js Architecture',
        price: '349.99',
        maxEnrollments: 35,
        description: 'Updated description with new content...',
        updatedAt: '2026-02-13T11:00:00.000Z'
      }
    }
  },
  errorResponse: {
    statusCode: 409,
    body: {
      success: false,
      error: 'ConflictError',
      message: 'Course title already exists: React Fundamentals'
    }
  }
};

/**
 * 5. DELETE COURSE (DELETE /api/courses/:id)
 * 
 * Question 1: How to implement Delete operation
 * Question 3: CASCADE delete removes related enrollments
 * - All related enrollments are automatically deleted
 * - No orphaned records left
 */
const deleteCourseExample = {
  endpoint: 'DELETE /api/courses/:id',
  description: 'Delete a course and all its enrollments',
  parameters: {
    id: 1
  },
  cascadeNote: 'Deleting course with ID 1 also deletes 25 related enrollments',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Course 1 deleted successfully',
      data: null
    }
  }
};

/**
 * 6. GET COURSE STATISTICS (GET /api/courses/:id/stats)
 * 
 * Aggregated statistics about course and enrollments
 */
const getCourseStatsExample = {
  endpoint: 'GET /api/courses/:id/stats',
  description: 'Get statistics about course enrollments',
  parameters: { id: 1 },
  exampleUrl: 'GET /api/courses/1/stats',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Course statistics retrieved',
      data: {
        courseId: 1,
        courseTitle: 'Advanced Node.js Architecture',
        totalEnrollments: 25,
        enrollmentsAvailable: 5,           // maxEnrollments - current
        completedCount: 18,                // finished course
        certificatesIssued: 18,
        averageProgress: '78.50'           // percentage
      }
    }
  }
};

// ============================================================================
// ENROLLMENT API EXAMPLES
// ============================================================================

/**
 * 1. ENROLL STUDENT (POST /api/enrollments)
 * 
 * Question 3: One-to-Many relationship - many students enroll in one course
 * - Validates course exists
 * - Checks enrollment capacity
 * - Prevents duplicate enrollments (one student per course)
 */
const enrollStudentExample = {
  endpoint: 'POST /api/enrollments',
  description: 'Enroll a student in a course',
  request: {
    body: {
      courseId: 1,
      studentName: 'Alice Johnson',
      studentEmail: 'alice@example.com',
      // Optional fields with defaults:
      // completionStatus: 'Not Started',
      // progressPercentage: 0,
      // certificateObtained: false
    }
  },
  businessRules: [
    'Course must exist',
    'Course must not be full (< maxEnrollments)',
    'Student can only enroll once per course (unique constraint)',
    'Email format is validated'
  ],
  successResponse: {
    statusCode: 201,
    body: {
      success: true,
      message: 'Student enrolled successfully',
      data: {
        id: 42,
        courseId: 1,
        studentName: 'Alice Johnson',
        studentEmail: 'alice@example.com',
        enrollmentDate: '2026-02-13T12:00:00.000Z',
        completionStatus: 'Not Started',
        progressPercentage: 0,
        certificateObtained: false,
        createdAt: '2026-02-13T12:00:00.000Z',
        updatedAt: '2026-02-13T12:00:00.000Z'
      }
    }
  },
  errorScenarios: {
    duplicateEnrollment: {
      statusCode: 409,
      body: {
        success: false,
        error: 'ConflictError',
        message: 'Student alice@example.com is already enrolled in this course'
      }
    },
    courseFullError: {
      statusCode: 409,
      body: {
        success: false,
        error: 'ConflictError',
        message: 'Course is full. Maximum 30 students allowed'
      }
    },
    courseNotFound: {
      statusCode: 404,
      body: {
        success: false,
        error: 'NotFoundError',
        message: 'Course with ID 999 not found'
      }
    },
    invalidEmail: {
      statusCode: 400,
      body: {
        success: false,
        error: 'ValidationError',
        message: 'Enrollment validation failed',
        details: ['Invalid email format']
      }
    }
  }
};

/**
 * 2. READ ALL ENROLLMENTS (GET /api/enrollments)
 * 
 * Question 4: findAll() with filtering and eager loading
 */
const getAllEnrollmentsExample = {
  endpoint: 'GET /api/enrollments',
  description: 'Retrieve all enrollments with filters',
  queryParameters: {
    courseId: 1,                          // optional: filter by course
    status: 'Completed',                  // optional: Not Started | In Progress | Completed
    page: 1,                              // optional: page number
    limit: 20                             // optional: items per page
  },
  exampleUrl: 'GET /api/enrollments?courseId=1&status=Completed&limit=10',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Enrollments retrieved successfully',
      data: {
        enrollments: [
          {
            id: 1,
            courseId: 1,
            studentName: 'Alice Johnson',
            studentEmail: 'alice@example.com',
            enrollmentDate: '2026-02-01T09:00:00.000Z',
            completionStatus: 'Completed',
            progressPercentage: 100,
            certificateObtained: true,
            course: {
              id: 1,
              title: 'Advanced Node.js',
              instructor: 'Sarah Chen',
              level: 'Advanced'
            }
          }
        ],
        pagination: {
          total: 42,
          page: 1,
          limit: 20,
          totalPages: 3
        }
      }
    }
  }
};

/**
 * 3. UPDATE ENROLLMENT (PUT /api/enrollments/:id)
 * 
 * Question 1: Update operation with validation
 * - Auto-grants certificate when progress reaches 100%
 * - Updates completion status
 */
const updateEnrollmentExample = {
  endpoint: 'PUT /api/enrollments/:id',
  description: 'Update student enrollment progress',
  parameters: { id: 1 },
  request: {
    body: {
      progressPercentage: 100,
      completionStatus: 'Completed'
      // If progressPercentage === 100 and certificateObtained === false,
      // certificate is automatically granted
    }
  },
  autoGrant: 'Certificate automatically granted at 100% progress',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Enrollment updated successfully',
      data: {
        id: 1,
        courseId: 1,
        studentName: 'Alice Johnson',
        progressPercentage: 100,
        completionStatus: 'Completed',
        certificateObtained: true,
        updatedAt: '2026-02-13T15:30:00.000Z'
      }
    }
  }
};

/**
 * 4. UNENROLL STUDENT (DELETE /api/enrollments/:id)
 * 
 * Question 1: Delete operation
 */
const unenrollStudentExample = {
  endpoint: 'DELETE /api/enrollments/:id',
  description: 'Remove a student from a course',
  parameters: { id: 1 },
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Enrollment 1 deleted successfully',
      data: null
    }
  }
};

/**
 * 5. GET ENROLLMENTS BY COURSE (GET /api/enrollments/course/:courseId)
 * 
 * Question 3: Using One-to-Many relationship
 * - Course.hasMany(Enrollment) association
 * - Returns all students in a specific course
 */
const getEnrollmentsByCourseExample = {
  endpoint: 'GET /api/enrollments/course/:courseId',
  description: 'Get all students enrolled in a specific course',
  parameters: { courseId: 1 },
  exampleUrl: 'GET /api/enrollments/course/1',
  relationship: 'One Course has Many Enrollments',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Course enrollments retrieved',
      data: {
        courseId: 1,
        courseTitle: 'Advanced Node.js Architecture',
        totalEnrollments: 3,
        enrollments: [
          {
            id: 1,
            studentName: 'Alice Johnson',
            studentEmail: 'alice@example.com',
            completionStatus: 'Completed',
            progressPercentage: 100,
            enrollmentDate: '2026-02-01T09:00:00.000Z'
          },
          {
            id: 2,
            studentName: 'Bob Wilson',
            studentEmail: 'bob@example.com',
            completionStatus: 'In Progress',
            progressPercentage: 65,
            enrollmentDate: '2026-02-05T09:00:00.000Z'
          }
        ]
      }
    }
  }
};

/**
 * 6. GET STUDENT'S COURSES (GET /api/enrollments/student/:email)
 * 
 * Get all courses a specific student is enrolled in
 */
const getStudentEnrollmentsExample = {
  endpoint: 'GET /api/enrollments/student/:email',
  description: 'Get all courses a student is enrolled in',
  parameters: { email: 'alice@example.com' },
  exampleUrl: 'GET /api/enrollments/student/alice@example.com',
  successResponse: {
    statusCode: 200,
    body: {
      success: true,
      message: 'Student enrollments retrieved',
      data: {
        studentEmail: 'alice@example.com',
        enrollments: [
          {
            id: 1,
            courseId: 1,
            completionStatus: 'Completed',
            progressPercentage: 100,
            course: {
              id: 1,
              title: 'Advanced Node.js Architecture',
              instructor: 'Sarah Chen',
              level: 'Advanced',
              duration: 40
            }
          },
          {
            id: 3,
            courseId: 2,
            completionStatus: 'In Progress',
            progressPercentage: 45,
            course: {
              id: 2,
              title: 'React Fundamentals',
              instructor: 'John Smith',
              level: 'Beginner',
              duration: 30
            }
          }
        ]
      }
    }
  }
};

// ============================================================================
// EXAMPLE CURL COMMANDS
// ============================================================================

const curlExamples = `
# Create a course
curl -X POST http://localhost:3000/api/courses \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Kubernetes Fundamentals",
    "description": "Learn container orchestration with Kubernetes",
    "instructor": "John Doe",
    "duration": 50,
    "level": "Intermediate",
    "maxEnrollments": 40,
    "price": 249.99
  }'

# Get all courses
curl http://localhost:3000/api/courses?level=Advanced

# Get single course
curl http://localhost:3000/api/courses/1

# Update course
curl -X PUT http://localhost:3000/api/courses/1 \\
  -H "Content-Type: application/json" \\
  -d '{"price": 299.99, "maxEnrollments": 50}'

# Delete course
curl -X DELETE http://localhost:3000/api/courses/1

# Enroll student
curl -X POST http://localhost:3000/api/enrollments \\
  -H "Content-Type: application/json" \\
  -d '{
    "courseId": 1,
    "studentName": "Charlie Brown",
    "studentEmail": "charlie@example.com"
  }'

# Get course statistics
curl http://localhost:3000/api/courses/1/stats

# Get all students in course
curl http://localhost:3000/api/enrollments/course/1

# Get all courses for student
curl http://localhost:3000/api/enrollments/student/alice@example.com

# Update enrollment progress
curl -X PUT http://localhost:3000/api/enrollments/1 \\
  -H "Content-Type: application/json" \\
  -d '{
    "progressPercentage": 75,
    "completionStatus": "In Progress"
  }'

# Unenroll student
curl -X DELETE http://localhost:3000/api/enrollments/1
`;

module.exports = {
  createCourseExample,
  getAllCoursesExample,
  getCourseByIdExample,
  updateCourseExample,
  deleteCourseExample,
  getCourseStatsExample,
  enrollStudentExample,
  getAllEnrollmentsExample,
  updateEnrollmentExample,
  unenrollStudentExample,
  getEnrollmentsByCourseExample,
  getStudentEnrollmentsExample,
  curlExamples
};
