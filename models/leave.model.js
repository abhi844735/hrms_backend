const mongoose = require("mongoose");
const moment = require("moment-timezone");

const leaveSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    leaveType: { type: String, required: true, trim: true },
    leaveApplyDates: [{ type: String, required: true }], // Store dates as formatted strings
    reason: { type: String, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    appliedLeaveTimestamp: {
        type: String,
        default: () => moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
    } // Store timestamp as a formatted string
}, { timestamps: true });

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
