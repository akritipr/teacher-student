const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

router.post('/register', teacherController.register);
router.get('/commonstudents', teacherController.commonStudents);
router.post('/suspend', teacherController.suspend);
router.post('/retrievefornotifications', teacherController.retrieveForNotifications);
router.get('/students', teacherController.getStudents);
router.get('/studentsinfo', teacherController.getStudentsInfo);
router.get('/teachers', teacherController.getTeachers);
router.get('/teacherStudents', teacherController.getTeacherStudents);

module.exports = router;
