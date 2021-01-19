const express = require('express');
require('./db/mongoose');
const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port);

const HowDoYouFeel = require('./models/howDoYouFeelModel');
