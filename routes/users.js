const express = require("express");
const { login, register, current } = require("../controllers/user");
const { auth } = require("../middleware/auth");
const router = express.Router();

/* GET users listing. */
router.post("/login", login);
router.post("/register", register);
router.get("/current", auth, current);

module.exports = router;
