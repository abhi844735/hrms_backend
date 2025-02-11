const Leave = require("../models/leave.model");
const Employee = require("../models/employee.model");
require("dotenv").config();
const sendEmail = require("../utils/sendEmail");


exports.requestLeave = async (req, res) => {
    try {
        const { leaveType, leaveApplyDates, reason } = req.body;
        const employeeId = req.user.id;

        if (!leaveApplyDates || leaveApplyDates.length === 0) {
            return res.status(400).json({ message: "Leave dates are required" });
        }

        // // Convert leaveApplyDates to YYYY-MM-DD format (IST)
        // const leaveApplyDates = leaveApplyDates.map(date =>
        //     moment(date).tz("Asia/Kolkata").format("YYYY-MM-DD")
        // );

        const leave = new Leave({
            employee: employeeId,
            leaveType,
            leaveApplyDates,
            reason
        });

        await leave.save();

        // Add leave request to Employee's leave history
        await Employee.findByIdAndUpdate(employeeId, { $push: { leaveHistory: leave._id } });

        // Fetch Employee details for email
        const employee = await Employee.findById(employeeId);

        // Send email to HR/Admin
        const hrEmail = process.env.HR_EMAIL;
        await sendEmail(
            hrEmail,
            "New Leave Request Received",
            `Employee ${employee.name} (${employee.email}) has requested leave from ${leaveApplyDates[0]} to ${leaveApplyDates[leaveApplyDates.length - 1]}.\nReason: ${reason}`
        );

        // Send confirmation email to Employee
        await sendEmail(
            employee.email,
            "Your Leave Request is Pending",
            `Your leave request from ${leaveApplyDates[0]} to ${leaveApplyDates[leaveApplyDates.length - 1]} is currently pending approval.`
        );

        res.status(201).json({ message: "Leave request submitted successfully", leave });
    } catch (error) {
        console.log("error in requesting leave ",error.message);
        res.status(500).json({ message: "Server Error", error });
    }
}

exports.loggedInUserLeaves = async(req,res)=>{
    try {
        const leaves = await Leave.find({ employee: req.user.id });
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.allEmployeeLeaves = async(req,res)=>{
    try {
        const leaves = await Leave.find().populate("employee", "name email department");
        res.status(200).json(leaves);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.manageLeave = async(req,res)=>{
    try {
        const { leaveId } = req.params;
        const { status } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const leave = await Leave.findById(leaveId);
        if (!leave) return res.status(404).json({ message: "Leave request not found" });

        leave.status = status;
        leave.managedBy = req.user.id;
        await leave.save();

        // Fetch Employee details for email
        const employee = await Employee.findById(leave.employee);

        // Send email notification to Employee
        await sendEmail(
            employee.email,
            `Leave Request ${status}`,
            `Your leave request from ${leave.leaveApplyDates[0]} to ${leave.leaveApplyDates[leave.leaveApplyDates.length - 1]} has been ${status.toLowerCase()}.`
        );

        res.status(200).json({ message: `Leave ${status.toLowerCase()} successfully`, leave });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.cancelLeaveRequest = async(req,res)=>{
    try {
        const leave = await Leave.findOneAndDelete({ _id: req.params.leaveId, employee: req.user.id });
        if (!leave) return res.status(404).json({ message: "Leave request not found or not yours" });

        // Remove from Employee's leave history
        await Employee.findByIdAndUpdate(req.user.id, { $pull: { leaveHistory: req.params.leaveId } });

        res.json({ message: "Leave request canceled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
}

