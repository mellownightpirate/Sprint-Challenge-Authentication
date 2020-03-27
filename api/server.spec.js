const server = require("./server");
const request = require("supertest");

describe("server.js module", () => {
  it("has the correct environment for DB_ENV", () => {
    expect(process.env.DB_ENV).toBe("testing");
  });
});