const db = require('../db');
const teacherService = require('../services/teacherService');
beforeAll(async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS teachers (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      suspended BOOLEAN DEFAULT FALSE
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS teacher_students (
      teacher_id INTEGER REFERENCES teachers(id),
      student_id INTEGER REFERENCES students(id),
      PRIMARY KEY (teacher_id, student_id)
    );
  `);
});

afterAll(async () => {
  await db.query('DROP TABLE IF EXISTS teacher_students');
  await db.query('DROP TABLE IF EXISTS teachers');
  await db.query('DROP TABLE IF EXISTS students');
});

jest.mock('../db', () => ({
  query: jest.fn()
}));


// describe('POST /api/register', () => {
//   it('should register students to a teacher', async () => {
//     const res = await request(app)
//       .post('/api/register')
//       .send({
//         teacher: 'teacherken@example.com',
//         students: ['studentjon@example.com', 'studenthon@example.com'],
//       });
//     expect(res.statusCode).toEqual(204);
//   });
// });


describe('registerStudents', () => {
  it('should register students to a teacher', async () => {
    const teacherEmail = 'teacherken@example.com';
    const studentEmails = ['student1@example.com', 'student2@example.com'];

    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    db.query.mockResolvedValueOnce({ rows: [{ id: 2 }] });

    await teacherService.registerStudents(teacherEmail, studentEmails);

    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO teachers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id, email',
      [teacherEmail]
    );
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO students (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id, email',
      ['student1@example.com']
    );
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO students (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id, email',
      ['student2@example.com']
    );
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO teacher_students (teacher_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [1, 1]
    );
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO teacher_students (teacher_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [1, 2]
    );
  });

  describe('getCommonStudents', () => {
    it('should return common students for given teacher emails', async () => {
      const teacherEmails = ['teacherken@example.com', 'teacherjoe@example.com'];
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }, { id: 2 }] })
        .mockResolvedValueOnce({
          rows: [{ email: 'commonstudent1@gmail.com' }, { email: 'commonstudent2@gmail.com' }]
        });

      const result = await teacherService.getCommonStudents(teacherEmails);
      expect(result).toEqual(['commonstudent1@gmail.com', 'commonstudent2@gmail.com']);
    });
  });

  describe('getStudents', () => {
    it('should return all students', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ email: 'student1@example.com' }, { email: 'student2@example.com' }] });
      const result = await teacherService.getStudents();
      expect(result).toEqual(['student1@example.com', 'student2@example.com']);
    });
  });

  describe('getStudentsInfo', () => {
    it('should return all students info', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: 'student1@example.com' }, { id: 2, email: 'student2@example.com' }] });
      const result = await teacherService.getStudentsInfo();
      expect(result).toEqual([{ id: 1, email: 'student1@example.com' }, { id: 2, email: 'student2@example.com' }]);
    });
  });

  describe('suspendStudent', () => {
    it('should suspend a student', async () => {
      const studentEmail = 'student1@example.com';
      db.query.mockResolvedValueOnce();
      await teacherService.suspendStudent(studentEmail);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE students SET suspended = TRUE WHERE email = $1',
        [studentEmail]
      );
    });
  });

  describe('getNotificationRecipients', () => {
    it('should return recipients for a notification', async () => {
      const teacherEmail = 'teacherken@example.com';
      const notificationText = 'Hello @studentagnes@example.com @studentmiche@example.com';
      db.query
        .mockResolvedValueOnce({ rows: [{ id: 1 }] })
        .mockResolvedValueOnce({
          rows: [{ email: 'studentagnes@example.com' }, { email: 'studentmiche@example.com' }]
        });
      const result = await teacherService.getNotificationRecipients(teacherEmail, notificationText);
      expect(result).toEqual(['studentagnes@example.com', 'studentmiche@example.com']);
    });
  });

  describe('getTeachers', () => {
    it('should return all teachers', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ email: 'teacher1@example.com' }, { email: 'teacher2@example.com' }] });
      const result = await teacherService.getTeachers();
      expect(result).toEqual([{ email: 'teacher1@example.com' }, { email: 'teacher2@example.com' }]);
    });
  });

  describe('getTeacherStudents', () => {
    it('should return all teacher-student relationships', async () => {
      db.query.mockResolvedValueOnce({ rows: [{ teacher_id: 1, student_id: 1 }, { teacher_id: 2, student_id: 2 }] });
      const result = await teacherService.getTeacherStudents();
      expect(result).toEqual([{ teacher_id: 1, student_id: 1 }, { teacher_id: 2, student_id: 2 }]);
    });
  });
});