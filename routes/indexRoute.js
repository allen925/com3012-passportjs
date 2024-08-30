const express = require("express");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const userController = require("../controllers/userController");

router.get("/", (req, res) => {
  res.render('welcome', { users: userController.getDatabase() });
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

module.exports = router;