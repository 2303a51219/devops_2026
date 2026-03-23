const express = require('express');
const CourseController = require('../controllers/CourseController');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Course Routes - Demonstrates CRUD operations
 */

// CREATE - POST /api/courses
router.post('/', asyncHandler(async (req, res) => {
  const course = await CourseController.createCourse(req.body);
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: course
  });
}));

// READ - GET /api/courses
router.get('/', asyncHandler(async (req, res) => {
  const result = await CourseController.getAllCourses(req.query);
  res.status(200).json({
    success: true,
    message: 'Courses retrieved successfully',
    data: result
  });
}));

// READ - GET /api/courses/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await CourseController.getCourseById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Course retrieved successfully',
    data: course
  });
}));

// UPDATE - PUT /api/courses/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const course = await CourseController.updateCourse(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: course
  });
}));

// DELETE - DELETE /api/courses/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const result = await CourseController.deleteCourse(req.params.id);
  res.status(200).json({
    success: true,
    message: result.message,
    data: null
  });
}));

// GET - /api/courses/:id/stats
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const stats = await CourseController.getCourseStats(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Course statistics retrieved',
    data: stats
  });
}));

// BULK CREATE - POST /api/courses/bulk
router.post('/bulk', asyncHandler(async (req, res) => {
  const courses = await CourseController.bulkCreateCourses(req.body);
  res.status(201).json({
    success: true,
    message: `${courses.length} courses created successfully`,
    data: courses
  });
}));

module.exports = router;
