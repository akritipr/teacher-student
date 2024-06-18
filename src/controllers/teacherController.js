const teacherService = require('../services/teacherService');
const responseHandler = require('../utils/responseHandler');

exports.register = async (req, res) => {
  try {
    const { teacher, students } = req.body;
    await teacherService.registerStudents(teacher, students);
    responseHandler(res, 204);
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
};

exports.commonStudents = async (req, res) => {
  try {
    const { teacher } = req.query;
    const teachers = Array.isArray(teacher) ? teacher : [teacher];
    const teachersFetched = await teacherService.getSpecificTeachers(teachers);
    if(teachersFetched.rowCount === 0){
      responseHandler(res, 404, { message: "Teachers not found" });
    }else{
      const students = await teacherService.getCommonStudents(teachers);
      responseHandler(res, 200, { students });
    }  
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
};

exports.suspend = async (req, res) => {
  try {
    const { student } = req.body;
    const studentCheck = await teacherService.checkStudent(student);
    if (studentCheck.rowCount === 0) {
      responseHandler(res, 404, { message: 'Student not found' })
    }else{
      const studentSuspended = await teacherService.suspendStudent(student);
      if (studentSuspended.rowCount === 0) {
        responseHandler(res, 500, { message: 'Failed to suspend student' })
      }else{
        responseHandler(res, 200, { message: 'Student suspended successfully.' });
      }
    }
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
};

exports.retrieveForNotifications = async (req, res) => {
  try {
    const { teacher, notification } = req.body;
    const recipients = await teacherService.getNotificationRecipients(
      teacher,
      notification
    );
    responseHandler(res, 200, { recipients });
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await teacherService.getStudents();
    responseHandler(res, 200, { students });
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
}

exports.getStudentsInfo = async (req, res) => {
  try {
    const students = await teacherService.getStudentsInfo();
    responseHandler(res, 200, { students });
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
}

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await teacherService.getTeachers();
    responseHandler(res, 200, { teachers });
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
}

exports.getTeacherStudents = async (req, res) => {
  try {
    const teacherStudents = await teacherService.getTeacherStudents();
    responseHandler(res, 200, { teacherStudents });
  } catch (error) {
    responseHandler(res, 500, null, error);
  }
}