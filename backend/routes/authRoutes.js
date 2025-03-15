const express = require("express");
const { register, login, confirmAccount, recoverPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirmar/:token", confirmAccount);
router.post("/recover-password", recoverPassword);
router.post("/reset-password", resetPassword);

module.exports = router;