const express = require('express');
const router = express.Router();
const { register, login, logout } = require("../controllers/auth.controller");
const { authMiddleware } = require('../middlewares/auth.middleware');
const { roleMiddleware } = require('../middlewares/role.middleware');

router.post("/register",authMiddleware,roleMiddleware(["hr"]),register);
router.post("/login",login);
router.get("/logout",logout);

module.exports = router;