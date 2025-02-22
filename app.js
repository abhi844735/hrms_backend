require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./utils/db");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const employeeRoute = require("./routes/employee.route");
const leaveRoute = require("./routes/leave.route");
const app = express();
app.use(express.json());
app.use(cookieParser());
// edit commit 

// app.use(cors({
//     origin: "http://localhost:5173", // Adjust as per your frontend
//     credentials: true, // Allow cookies
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));
app.use(cors());
// demo commit
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/employees",employeeRoute);
app.use("/api/v1/leaves",leaveRoute);
app.get("/",async(req,res)=>{
    try {
        res.json({message:"welcome to hrms backend"});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
app.listen(process.env.Server_PORT,async()=>{
    try {
        await connectToDatabase();
        console.log("server is running on port",process.env.Server_PORT);
    } catch (error) {
        console.log("error while establishing the server : ",error.message);
    }
})