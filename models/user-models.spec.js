const db = require("../database/dbConfig");
const Users = require("../models/user-models");

beforeEach(async () => {
  await db("users").truncate();
});

describe("user-models.js module", () => {
  describe("register()", () => {
    it("inserts a new user into the db", async () => {
      Users.register({ username: "admin", password: "1234" });
      const users = await db("users");
      expect(users).toHaveLength(1);
    });

    it("inserts a new user to the db without breaking the object", async () => {
      const user = await Users.register({
        username: "admin",
        password: "1234"
      });
      expect(user).toMatchObject({ username: "admin", password: "1234" });
    });
  });

  describe("login()", () => {
    it("returns the user object which doesn't include a password", async () => {
      await db("users").insert({ username: "admin", password: "1234" });
      const user = Users.login({ username: "admin", password: "1234" });
      expect(user).not.toMatchObject({ username: "admin", password: "1234" });
    });
    it("returns a truthy object", async () => {
      await db("users").insert({ username: "admin", password: "1234" });
      const user = Users.login({ username: "admin", password: "1234" });
      expect(user).toBeTruthy();
    });
  });

  describe("getAllUsers()", () => {
    it("returns an array of users from the db", async () => {
      await db("users").insert({ username: "admin", password: "1234" });
      await db("users").insert({ username: "Amin", password: "5678" });
      const users = await Users.getUsers();
      expect(users).toHaveLength(2);
    });

    it("returns an object containing a username attribute", async () => {
      await db("users").insert({ username: "admin", password: "1234" });
      const users = await Users.getUsers();
      expect(users).toMatchObject([{ username: "admin" }]);
    });
  });
});