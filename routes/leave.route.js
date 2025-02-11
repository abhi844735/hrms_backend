const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const { roleMiddleware } = require("../middlewares/role.middleware");
const { requestLeave, loggedInUserLeaves, allEmployeeLeaves, manageLeave, cancelLeaveRequest } = require("../controllers/leave.controller.");
const router = express.Router();

// ✅ Employee submits a leave request
router.post("/request",authMiddleware,requestLeave);

//// ✅ Employee gets their leave requests
router.get("/loggedInUserLeaves",authMiddleware,loggedInUserLeaves);

// ✅ HR gets all leave requests
router.get("/allEmployeeLeaves",authMiddleware,roleMiddleware(["hr"]),allEmployeeLeaves);


// ✅ HR approves/rejects a leave request
router.put("/:leaveId/status",authMiddleware,roleMiddleware(["hr"]),manageLeave);

// ✅ Employee cancels a leave request
router.delete("/:leaveId/cancel",authMiddleware,cancelLeaveRequest);

module.exports = router;