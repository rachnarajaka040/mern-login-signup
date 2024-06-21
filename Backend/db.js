// const mongoose = require("mongoose");

// const connection = async () => {
//   await mongoose.connect(
//     "mongodb+srv://rachna:12345@cluster0.d5ixq3k.mongodb.net/inotebooks"
//   );
// };

// module.exports = connection;


const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;

const createConnection = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

module.exports = createConnection;
