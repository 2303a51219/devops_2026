require('dotenv').config();
const sequelize = require('./config/database');
const app = require('./app');
const { Course, Enrollment } = require('./models');

const PORT = process.env.PORT || 3000;

/**
 * Database synchronization and server startup
 */
const startServer = async () => {
  try {
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    console.log('🔄 Synchronizing database models...');
    // Set alter: true in development to auto-migrate, false in production
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database models synchronized');

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📝 API Documentation:`);
      console.log(`   GET  /api/courses         - List all courses`);
      console.log(`   POST /api/courses         - Create new course`);
      console.log(`   GET  /api/courses/:id     - Get course details`);
      console.log(`   PUT  /api/courses/:id     - Update course`);
      console.log(`   DELETE /api/courses/:id   - Delete course`);
      console.log(`   GET  /api/courses/:id/stats - Course statistics`);
      console.log(`   POST /api/enrollments     - Enroll student`);
      console.log(`   GET  /api/enrollments     - List all enrollments`);
      console.log(`   PUT  /api/enrollments/:id - Update enrollment`);
      console.log(`   DELETE /api/enrollments/:id - Unenroll student`);
      console.log(`\n✨ Run 'npm test' to execute demo operations\n`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

startServer();
