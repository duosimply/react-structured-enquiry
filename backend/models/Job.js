// models/Job.js

const db = require('../config/db');

const Job = {
  // Get all jobs
  getAll: async ({salary, loc, exp}) => {
    const [rows] = await db.execute(`SELECT * FROM jobs WHERE location = ${loc} and salary = ${salary} and experience = ${exp};`);
    return rows;
  },

  // Add a new job listing
  add: async (title, company, location, experience, salary) => {
    const [result] = await db.execute(
      'INSERT INTO jobs (title, company, location, experience, salary) VALUES (?, ?, ?, ?, ?)',
      [title, company, location, experience, salary]
    );
    return result;
  }
};

module.exports = Job;
