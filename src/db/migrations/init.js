const { query } = require('../index');

const createTables = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      suspended BOOLEAN DEFAULT FALSE
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS teacher_students (
      teacher_id INTEGER REFERENCES teachers(id),
      student_id INTEGER REFERENCES students(id),
      PRIMARY KEY (teacher_id, student_id)
    );
  `);
};

createTables()
  .then(() => console.log('Tables created successfully'))
  .catch((err) => console.error('Error creating tables', err))
  .finally(() => process.exit());
