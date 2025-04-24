const express = require("express");
const { register, login, confirmAccount, recoverPassword, resetPassword } = require("../controllers/authController");
const {geteventos, geteventoe, postevento, putevento, deleteevento, getexpositores, getpatrocinadores} = require("../controllers/eventosController");
const {getperfil} = require("../controllers/usuarioController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirmar/:token", confirmAccount);
router.post("/recover-password", recoverPassword);
router.post("/reset-password", resetPassword);
router.get("/eventos", geteventos);
router.get("/eventos/:id", geteventoe);
router.post("/eventos", postevento);
router.put("/eventos/:id", putevento);
router.delete("/eventos/:id", deleteevento);
router.get("/usuario/perfil", getperfil);
router.get("/expositores",getexpositores);
router.get("/patrocinadores",getpatrocinadores);

module.exports = router;