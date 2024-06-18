// src/db/index.js
const { Pool } = require('pg');
require('dotenv').config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  user: 'postgres',
  host: 'database-teacher-student.cf8246awoon5.ap-southeast-2.rds.amazonaws.com',
  database: '',
  password: 'Admin!123',
  port: 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
