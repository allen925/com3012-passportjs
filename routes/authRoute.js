const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

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

module.exports = router;