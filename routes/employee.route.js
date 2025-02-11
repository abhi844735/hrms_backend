const express = require("express");
const router = express.Router();
const Employee = require("../models/employee.model");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { getAllEmployeesDetail, getLoggedInEmployeeDetail, updateLoggedInEmployeeProfile, deleteEmployee } = require("../controllers/employee.controller");

// ✅ Get all employees (Only for  HR)
router.get("/getAllEmployeesDetail",authMiddleware,roleMiddleware(["hr"]),getAllEmployeesDetail);

// ✅ Get logged-in employee profile
router.get("/loggedInEmployeeDetail",authMiddleware,getLoggedInEmployeeDetail);

// ✅ Update Employee Profile (Only for Logged-in Employee)
router.put("/update",authMiddleware,updateLoggedInEmployeeProfile);

// ✅ Delete Employee (Only HR);
router.delete("/delete/:id",authMiddleware,roleMiddleware(["hr"]),deleteEmployee);


module.exports = router;