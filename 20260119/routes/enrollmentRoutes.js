const express = require('express');
const EnrollmentController = require('../controllers/EnrollmentController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Enrollment Routes - Demonstrates relationships and operations
 */

// CREATE - POST /api/enrollments
router.post('/', asyncHandler(async (req, res) => {
  const enrollment = await EnrollmentController.enrollStudent(req.body);
  res.status(201).json({
    success: true,
    message: 'Student enrolled successfully',
    data: enrollment
  });
}));

// READ - GET /api/enrollments
router.get('/', asyncHandler(async (req, res) => {
  const result = await EnrollmentController.getAllEnrollments(req.query);
  res.status(200).json({
    success: true,
    message: 'Enrollments retrieved successfully',
    data: result
  });
}));

// READ - GET /api/enrollments/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const enrollment = await EnrollmentController.getEnrollmentById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Enrollment retrieved successfully',
    data: enrollment
  });
}));

// UPDATE - PUT /api/enrollments/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const enrollment = await EnrollmentController.updateEnrollment(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Enrollment updated successfully',
    data: enrollment
  });
}));

// DELETE - DELETE /api/enrollments/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await EnrollmentController.unenrollStudent(req.params.id);
  res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
}));

// READ - GET /api/enrollments/course/:courseId
router.get('/course/:courseId', asyncHandler(async (req, res) => {
  const result = await EnrollmentController.getEnrollmentsByCourse(req.params.courseId);
  res.status(200).json({
    success: true,
    message: 'Course enrollments retrieved',
    data: result
  });
}));

// READ - GET /api/enrollments/student/:email
router.get('/student/:email', asyncHandler(async (req, res) => {
  const result = await EnrollmentController.getStudentEnrollments(req.params.email);
  res.status(200).json({
    success: true,
    message: 'Student enrollments retrieved',
    data: result
  });
}));

module.exports = router;
