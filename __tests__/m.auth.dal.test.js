const {
  getUserByEmail,
  deleteUser,
  addUser,
} = require("../model/controllers/m.auth.dal");

// const { displayAllMongoMovies } = require("../model/controllers/m.movies.dal");

test("addUser function testing", async () => {
  //Test Criteria 1
  const userInfo = {
    name: "Test Tester",
    email: "test.test@testing.com",
    password: "123456789",
  };
  await addUser(userInfo);
  let user = await getUserByEmail(userInfo.email);
  expect(user.email).toEqual(expect.stringMatching(userInfo.email));

  //Test Criteria 2
  let userInfo2 = {
    name: "Testing Tester",
    email: "test2.test2@testing.com",
    password: "123456789",
  };
  await addUser(userInfo2);
  let user2 = await getUserByEmail(userInfo2.email);
  expect(user2.email).toEqual(expect.stringMatching(userInfo2.email));
});

test("getUserByEmail function testing", async () => {
  // await getUserByEmail("hockeyman136@hotmail.com").objectContaining({
  //   x: expect.arrayContaining({ name: "Chris Doucette" }),
  // });
  let email = "test.test@testing.com";
  let user = await getUserByEmail(email);
  expect(user.email).toEqual(expect.stringMatching(email));

  email = "test2.test2@testing.com";
  user = await getUserByEmail(email);
  expect(user.email).toEqual(expect.stringMatching(email));
});

test("deleteUser function testing", async () => {
  // Deleting users created in addUser Test function
  const userEmail1 = "test.test@testing.com";
  const userEmail2 = "test2.test2@testing.com";

  let user1 = await deleteUser(userEmail1);
  // console.log(user1);
  expect(user1).toEqual({ acknowledged: true, deletedCount: 1 });

  let user2 = await deleteUser(userEmail2);
  // console.log(user2);
  expect(user2).toEqual({ acknowledged: true, deletedCount: 1 });
});

// afterAll(() => {
//   dal.close();
// });
