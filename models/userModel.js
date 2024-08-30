// email password not necessary
const database = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "admin"
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user"
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user"
  },
];

const userModel = {
  findOne: (email) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with email: ${email}`);
  },
  findByName: (name) => {
    const user = database.find((user) => user.name === name);
    if (user) {
      return user;
    }
    return null;
  },
  findById: (id) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    throw new Error(`Couldn't find user with id: ${id}`);
  },
  addUser: (user, oauth, token) => {
    const existingUser = database.find(u => u.name === user.name && u?.login === oauth);
    if (existingUser) {
      throw new Error('User with this email with login way already exists');
    }
    user.id = database.length + 1;
    user.login = oauth
    if (!!token)
      user.token = token
    database.push(user);
    return user;
  }, 
  updateToken: (user, oauth, token) => {
    let existingUser = database.find(u => u.name === user.name && u?.login === oauth);

    if (!existingUser) {
      throw new Error('User does not exists.');
    }
    existingUser.token = token; 
    return existingUser;
  },
  getDatabase: () => {
    return database;
  }
};

module.exports = { database, userModel };
