const mongoose = require("mongoose");
require("dotenv").config();
const connectToDatabase = async()=>{
    try {
        await mongoose.connect(process.env.MongoDB_URL);
        console.log("connected to MongoDB")
    } catch (error) {
        console.log("error while connecting to database",error.message);
    }
};

module.exports = {connectToDatabase};