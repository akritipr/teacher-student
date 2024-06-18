const express = require('express');
const bodyParser = require('body-parser');
const teacherRoutes = require('./routes/teacherRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(bodyParser.json());
app.use('/api', teacherRoutes);
app.use(errorHandler);

module.exports = app;
