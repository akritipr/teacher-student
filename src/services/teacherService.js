const db = require('../db');

exports.registerStudents = async (teacherEmail, studentEmails) => {
    const teacherRes = await db.query(
        'INSERT INTO teachers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id, email',
        [teacherEmail]
    );
    let teacherId = teacherRes.rows[0]?.id;
    if (!teacherId) {
        const teacherResponse = await db.query(
            'SELECT id FROM teachers WHERE email = $1',
            [teacherEmail]
        )
        teacherId = teacherResponse.rows[0]?.id;
    }

    const studentIds = [];
    for (const email of studentEmails) {
        const studentRes = await db.query(
            'INSERT INTO students (email) VALUES ($1) ON CONFLICT (email) DO NOTHING RETURNING id, email',
            [email]
        );
        let studentId = studentRes.rows[0]?.id;
        if (!studentId) {
            const studentResponse = await db.query(
                'SELECT id from students where email = $1', [email]
            );
            studentId = studentResponse.rows[0]?.id;
        }
        studentIds.push(studentId);
    }

    for (const studentId of studentIds) {
        await db.query(
            'INSERT INTO teacher_students (teacher_id, student_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [teacherId, studentId]
        );
    }
};

exports.getSpecificTeachers = async(teacherEmails) => {
    const teacherIdsRes = await db.query(
        'SELECT id FROM teachers WHERE email = ANY($1)',
        [teacherEmails]
    );
    return teacherIdsRes;
}

exports.getCommonStudents = async (teacherEmails) => {
    const teacherIdsRes = await db.query(
        'SELECT id FROM teachers WHERE email = ANY($1)',
        [teacherEmails]
    );
    
    const teacherIds = teacherIdsRes.rows.map((row) => row.id);

    const commonStudentsRes = await db.query(
        `
    SELECT s.email
    FROM students s
    JOIN teacher_students ts ON s.id = ts.student_id
    WHERE ts.teacher_id = ANY($1)
    GROUP BY s.email
    HAVING COUNT(s.id) = $2
    `,
        [teacherIds, teacherIds.length]
    );

    return commonStudentsRes.rows.map((row) => row.email);
};

exports.getStudents = async () => {
    const students = await db.query(
        'SELECT * FROM students'
    );

    return students.rows.map(s => s.email);
};

exports.getStudentsInfo = async () => {
    const students = await db.query(
        'SELECT * FROM students'
    );

    return students.rows.map(s => s);
}

exports.suspendStudent = async (studentEmail) => {
    const update = await db.query(
        'UPDATE students SET suspended = TRUE WHERE email = $1',
        [studentEmail]
    );
    return update;
};

exports.checkStudent = async (studentEmail) => {
    const checkStudent = await db.query(
        'SELECT id FROM students WHERE email = $1',
        [studentEmail]
    );
    return checkStudent;
}
exports.getNotificationRecipients = async (teacherEmail, notificationText) => {
    const teacherRes = await db.query(
        'SELECT id FROM teachers WHERE email = $1',
        [teacherEmail]
    );
    const teacherId = teacherRes.rows[0]?.id;

    const mentionedEmails = (notificationText.match(/@\S+@\S+/g) || []).map(
        (email) => email.slice(1)
    );

    const recipientsRes = await db.query(
        `
    SELECT s.email
    FROM students s
    LEFT JOIN teacher_students ts ON s.id = ts.student_id
    WHERE (ts.teacher_id = $1 OR s.email = ANY($2)) AND s.suspended = FALSE
    GROUP BY s.email
    `,
        [teacherId, mentionedEmails]
    );

    return recipientsRes.rows.map((row) => row.email);
};

exports.getTeachers = async () => {
    const teachers = await db.query(
        'SELECT * FROM teachers'
    )
    return teachers.rows.map(s => s);
}

exports.getTeacherStudents = async () => {
    const teachers = await db.query(
        'SELECT * FROM teacher_students'
    )
    return teachers.rows.map(s => s);
}
