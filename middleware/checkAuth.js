module.exports = {
  // used to ensure normal users are logged in
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/auth/login");
  },
  // used to ensure admin is logged in
  ensureAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.redirect("/auth/login");
  },
  // flow the user/admin to where they should go when to /auth/login
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated())
      return next();
    else if (req.user.role === 'admin')
      res.redirect("/admin")
    else
      res.redirect("/dashboard");
  },
};
