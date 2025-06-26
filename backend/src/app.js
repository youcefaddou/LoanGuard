const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const loanRoutes = require('./routes/loan');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);

module.exports = app;