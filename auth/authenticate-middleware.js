/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

const jwt = require("jsonwebtoken");
const Users = require("../models/user-models");

module.exports = {
  authenticate,
  validateRequestBody,
  validateUsername
};

function authenticate(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "TheSecret",
      (err, decoded) => {
        if (err) {
          res.status(401).json({ message: "Invalid token" });
        } else {
          req.decodedToken = decoded;
          next();
        }
      }
    );
  } else {
    res.status(400).json({ message: "No credentials provided" });
  }
}

function validateRequestBody(req, res, next) {
  if (req.body.username && req.body.password) {
    next();
  } else if (req.body.username || req.body.password) {
    res.status(400).json(`Please provide a valid username and password`);
  } else {
    res.status(400).json(`You must provide a valid username and password`);
  }
}

function validateUsername(req, res, next) {
  Users.getUsers()
    .then(users => {
      let usernames = users.map(curr => curr.username);
      if (usernames.includes(req.body.username)) {
        next();
      } else {
        res.status(400).json(`Invalid username`);
      }
    })
    .catch(error => {
      res.status(400).json(`Error validating username`);
    });
}
 