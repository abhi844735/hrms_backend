const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employee.model");
require("dotenv").config();

exports.register = async (req, res) => {
    try {
        const { name, email, password, department, role, contact } = req.body;

        // Check if employee already exists
        let employee = await Employee.findOne({ email });
        if (employee) return res.status(400).json({ message: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new employee
        employee = new Employee({
            name, email, password: hashedPassword, department, role, contact
        });

        await employee.save();

        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.login = async(req,res)=>{
    try {
        const { email, password } = req.body;

        // Check if user exists
        const employee = await Employee.findOne({ email });
        if (!employee) return res.status(400).json({ message: "Invalid email" });

        // Compare passwords
        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: employee._id, role: employee.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" } // Set JWT token expiration to 7 days
        );
        
        // Store token in HTTP-Only Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Important for deployment
            sameSite: "None", // Allow cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

        res.status(200).json({ message: "Login successful", user: { name: employee.name, email: employee.email, role: employee.role }, });

    } catch (error) {
         res.status(500).json({ message: "Server Error", error });
    }
};
exports.logout = async(req,res)=>{
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 0, // Expire immediately
      });
      res.status(200).json({ message: "Logged out successfully" });
}