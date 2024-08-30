const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
  }), (req, res) => {
    if (req.user.role === 'user') {
      res.redirect('/dashboard')
    } else if (req.user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect("/auth/login")
    }
  }
);

router.get("/logout", async (req, res) => {
  if (req.user && req.user.login === 'github' && req.user.token != undefined) {
    const response = await fetch(`https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.GITHUB_CLIENT_ID}:${process.env.GITHUB_CLIENT_SECRET}`).toString('base64')}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ access_token: req.user?.token })
    });
  }

  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    req.logout();
    res.redirect("/auth/login");
  });
});

// GET /auth/register - Show the registration form
router.get("/register", (req, res) => {
  res.render("register");
});

// POST /auth/register - Handle registration
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    let user = userController.getUserByName(name);
    if (user) {
      // User already exists
      return res.status(400).send("User already exists with this name.");
    }

    // Add user to the database
    user = userController.tryAddUserUpdateToken({
      name: name,
      email: email,
      password: password,
      role: role,
      login: 'manual',
    }, 'manual', null);

    req.login(user, (err) => {
      if (err) {
        return res.status(500).send("Error logging in new user.");
      }
      return res.redirect('/dashboard'); // Redirect based on role, assuming user is directly logged in
    });
  } catch (error) {
    res.status(500).send("Registration failed: " + error.message);
  }
});

module.exports = router;