const userModel = require("../models/userModel").userModel;

const getUserByEmailIdAndPassword = (email, password) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password;
}

const getUserByName = (name) => {
  let user = userModel.findByName(name);
  if (user) {
    return user;
  }
  return null;
}

// always return user info
function tryAddUserUpdateToken(newUser, oauth, token) {
  let user = getUserByName(newUser.name)
  if (!user){
    user = userModel.addUser(newUser, oauth, token);
  } else {
    user = userModel.updateToken(user, oauth, token);
  }
  return user;
}

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  getUserByName,
  tryAddUserUpdateToken,
};
