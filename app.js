const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const connectDB = require('./db/db');

const port = 3000;

// db connection
connectDB();

const app = express();
app.use(bodyParser.json());

// endpoints
app.use('/users', userRoutes);

// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
