const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const userController = require("../controllers/userController");

const githubLogin = new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:8000/auth/github/callback",
  scope: 'user'
},
  function (accessToken, refreshToken, profile, cb) {
    // refreshToken is null
    // Data structore stored of user is {id, name, role 'user', way login like 'github' login, token}
    const newUser = {
      name: profile.username,
      role: 'user'
    }
    let user = userController.tryAddUserUpdateToken(newUser, 'github', accessToken);

    return cb(null, user);
  }
)

const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
        message: "Your login details are not valid. Please try again",
      });
  }
);

passport.serializeUser(function (req, user, done) {
  let loginway = user.login ? user.login : 'local'
  let logintoken = user.token
  done(null, { userid: user.id, userrole: user.role, userlogin: loginway, usertoken: logintoken });
});

passport.deserializeUser(function (userSession, done) {
  let user = userController.getUserById(userSession.userid);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin).use(githubLogin);
