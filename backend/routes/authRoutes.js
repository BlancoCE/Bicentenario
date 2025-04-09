const express = require("express");
const { register, login, confirmAccount, recoverPassword, resetPassword } = require("../controllers/authController");
const {geteventos, geteventoe, postevento, putevento, deleteevento} = require("../controllers/eventosController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirmar/:token", confirmAccount);
router.post("/recover-password", recoverPassword);
router.post("/reset-password", resetPassword);
router.get("/eventos", geteventos);
router.get("/eventos/:id", geteventoe);
router.post("/añadirevento", postevento);
router.put("/eventos/:id", putevento);
router.delete("/eventos/:id", deleteevento);

module.exports = router;