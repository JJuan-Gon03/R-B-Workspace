/**
Functionality #1: Sign-up	
Scenario #1: Successful signup.
Given: User submits a POST request to “/users” is created with a unique username and password
When: The request is received by the server
Then: The user’s password gets hashed, stores the user information, and returns a 201 created status.
 */

describe("Sign up", () => {
  context("Successful Sign up", () => {
    before(() => {});

    let user;
    it("GIVEN my user object has a unique username and password", () => {
      user = {
        username: "superuniqueusernamepleasenoonetakethis2",
        password: "password",
      };
    });

    it("WHEN I attempt to post the user", () => {
      console.log(cy.env(["BACKEND_URL"]));
      cy.request("POST", `http://localhost:8000/users`, user).then(
        (response) => {
          assert.equal(
            response.status,
            201,
            "THEN I recieve a successful response (code 201)"
          );
          assert.exists(
            response.body,
            "AND the response contains the user object's ID"
          );
        }
      );
    });
  });
});
