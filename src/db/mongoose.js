const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true  }, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("Database connected");
});
