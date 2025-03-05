const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { all, add } = require("../controllers/employees");

// /api/employees
router.get("/", auth, all);

// /api/employees/:id
router.get("/:id", auth, () => console.log("get single employee"));

// /api/employees/add
router.post("/add", auth, add);

// /api/employees/remove/:id
router.delete("/remove/:id", auth, () => console.log("post remove employee"));

// /api/employees/edit/:id
router.patch("/edit", auth, () => console.log("post add employee"));

module.exports = router;
