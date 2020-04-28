const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  authenticate,
  validateRequestBody,
  validateUsername
} = require("./authenticate-middleware");
const Users = require("../models/user-models");
function makeToken(user) {
  const payload = {
    sub: user.id,
    username: user.username
  };
  const options = {
    expiresIn: 1000 * 60 * 10
  };
  const token = jwt.sign(
    payload,
    process.env.JWT_SECRET || "TheSecret",
    options
  );
  return token;
}

router.post("/register", validateRequestBody, (req, res) => {
  // implement registration
  const { username, password } = req.body;

  const bcryptHash = bcrypt.hashSync(password, 13);
  const user = {
    username,
    password: bcryptHash
  };

  Users.register(user)
    .then(id => {
      res.status(201).json(`New user registered with id: ${id}`);
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
});

router.post("/login", validateRequestBody, validateUsername, (req, res) => {
  // implement login
  const { username, password } = req.body;
  Users.login({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = makeToken(user);
        res
          .status(200)
          .json({ message: `Logged in! Welcome back ${user.username}`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
});
router.get("/users", authenticate, (req, res) => {
  Users.getUsers()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json(error.message);
    });
});

module.exports = router;
