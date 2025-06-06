const express = require("express");
const { register, login, confirmAccount, recoverPassword, resetPassword } = require("../controllers/authController");
const { registerToEvent, getEventosPorTipo, subscribirse, geteventos, get5eventos, geteventoe, postevento, putevento, deleteevento, getexpositores, getpatrocinadores} = require("../controllers/eventosController");
const {getperfil, getusuarios, getrol, getroles, putrol, suscrito} = require("../controllers/usuarioController");
const { getstats } = require("../controllers/statsController");
const { generarQR } = require("../services/QRService")
const router = express.Router();

router.post("/eventos/:eventId/register", registerToEvent);
router.get("/eventos/:id/qr", generarQR);
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
router.get("/usuarios",getusuarios);
router.get("/rol", getrol);
router.get("/5eventos",get5eventos);
router.get("/roles", getroles);
router.put("/usuarios/:id/rol",putrol);
router.post("/subscribirse",subscribirse);
router.get("/suscrito",suscrito);
router.get("/stats", getstats);
router.get("/tipo/evento",getEventosPorTipo);

module.exports = router;