const Employee = require("../models/employee.model");

exports.getAllEmployeesDetail = async (req, res) => {
    try {
        const { name } = req.query;

        let query = {}; // Default to fetching all employees
        if (name) {
            query.name = { $regex: name, $options: "i" }; // Case-insensitive search
        }

        const employees = await Employee.find(query).select("-password");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


exports.getLoggedInEmployeeDetail = async(req,res)=>{
    try {
        const employee = await Employee.findById(req.user.id).select("-password");
        if (!employee) return res.status(404).json({ message: "User not found" });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.updateLoggedInEmployeeProfile = async(req,res)=>{
    try {
        const { name, contact, department } = req.body;
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.user.id,
            { name, contact, department },
            { new: true }
        ).select("-password");

        res.json({ message: "Profile Updated", employee: updatedEmployee });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }

};

exports.deleteEmployee = async(req,res)=>{
    try {
        console.log("inside");
        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error", error });
    }
};
