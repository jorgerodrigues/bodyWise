const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/userRoutes');
const howDoYouFeelRouter = require('./routes/howDoYouFeelRoutes');

const app = express();

// ! Below is the stack of middlewares being passed to express.
// ! Express works in layers of middlewares and new middlewares can be defined and use by using the 'use' method as below.
// Automatically parse objects into json
app.use(express.json());
app.use(userRouter);
app.use(howDoYouFeelRouter);

module.exports = app;
