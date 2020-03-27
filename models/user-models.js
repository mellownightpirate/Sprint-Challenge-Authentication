const db = require("../database/dbConfig");

module.exports = {
  getUsers,
  login,
  register
};

async function getUsers() {
  return db("users");
}

async function login({ username }) {
  return db("users").where({ username });
}

async function register(user) {
  const [id] = await db("users").insert(user);
  return db("users")
    .where({ id })
    .first();
}