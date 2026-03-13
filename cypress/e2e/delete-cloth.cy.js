/**
2 * Functionality #2: Delete clothing item
3 * Scenario #1: Successful deletion
4 * Given:  The user has a piece of clothing in their wardrobe
5 * When:   The user clicks the "DELETE" button on a clothing item and a delete request is sent to the API
6 * Then:   The server returns a 200 ok status code and the clothing item is removed from the wardrobe
7 */

describe("Delete Clothing Item", () => {
  context("Successful Deletion", () => {
    let userId;
    let clothId;

    before(() => {
      cy.request("POST", "http://localhost:8000/users", {
        username: "deleteclothtest_" + Date.now(),
        password: "password",
      }).then((res) => {
        expect(res.status).to.eq(201);
        userId = res.body._id;

        cy.request({
          method: "POST",
          url: "http://localhost:8000/wardrobe",
          body: {
            user_id: userId,
            name: "Test Shirt",
            color: "Blue",
            type: "Shirts",
            tags: [],
            description: "A plain blue test shirt",
            img_url:
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
            public_id: "test_public_id_" + Date.now(),
          },
          failOnStatusCode: false,
        }).then((clothRes) => {
          expect(clothRes.status).to.eq(201);
          clothId = clothRes.body._id;
          expect(clothId).to.exist;
        });
      });
    });

    it("GIVEN the user has a piece of clothing in their wardrobe", () => {
      expect(userId).to.exist;
      expect(clothId).to.exist;
    });

    it("WHEN a DELETE request is sent to the API for that clothing item", () => {
      cy.request("DELETE", `http://localhost:8000/wardrobe/${clothId}`).then(
        (res) => {
          assert.equal(
            res.status,
            200,
            "THEN the server returns a 200 OK status code"
          );
        }
      );
    });

    it("AND the clothing item is removed from the wardrobe", () => {
      cy.request("GET", `http://localhost:8000/wardrobe/${userId}`).then(
        (res) => {
          expect(res.status).to.eq(200);
          const ids = res.body.map((item) => item._id);
          assert.notInclude(
            ids,
            clothId,
            "The deleted item no longer appears in the wardrobe"
          );
        }
      );
    });
  });
});
