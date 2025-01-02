// models/Application.js

const db = require('../config/db');

const Application = {
  // Apply for a job
  apply: async (userId, jobId) => {
    const [result] = await db.execute(
      'INSERT INTO applications (user_id, job_id) VALUES (?, ?)',
      [userId, jobId]
    );
    return result;
  },

  // Get all applications by user
  getByUserId: async (userId) => {
    const [rows] = await db.execute(
      'SELECT * FROM applications WHERE user_id = ?',
      [userId]
    );
    return rows;
  }
};

module.exports = Application;
