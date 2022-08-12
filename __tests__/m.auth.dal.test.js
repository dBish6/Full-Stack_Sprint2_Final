const {
  findUser,
  createUser,
  deleteUser,
} = require("../model/controllers/m.auth.dal");
// const { displayAllMongoMovies } = require("../model/controllers/m.movies.dal");

test("findUser function testing", async () => {
  expect(await findUser("chris.doucette@keyin.com", "123456789")).toBe(true);
  expect(await findUser("chris.doucette@keyin.com", "45678914354")).toBe(false);
  expect(await findUser("chris.doucette@outlook.com", "1234566789")).toBe(
    false
  );
});

test("createUser function testing", async () => {
  expect(
    await createUser("Testing McTester", "testing@test.com", "testtest")
  ).toBe(true);
  expect(
    await createUser("Chris Doucette", "chris.doucette@keyin.com", "123456789")
  ).toBe(false);
  expect(
    await createUser("Chris Doucette", "chris.doucette@keyin.com", "789456123")
  ).toBe(false);
});

test("deleteUser function testing", async () => {
  expect(
    await deleteUser("Testing McTester", "testing@test.com", "testtest")
  ).toBe(true);
  expect(
    await deleteUser("Chris Doucette", "chris.doucette@keyin.com", "789456123")
  ).toBe(false);
  expect(
    await deleteUser("Testing McTester", "testing@test.com", "testtest")
  ).toBe(false);
});
