const mongoose = require('mongoose');
const fs = require('fs');

connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `MongoDB Database Connected on HOSt : ${con.connection.host}`
      );
    })
    .catch((e) => {
      console.log(e.message);
    });
};

const dbConnect = mongoose.connection;
dbConnect.on('error', console.error.bind(console, 'MongoDB connection error:'));
module.exports = { connectDatabase, dbConnect };
