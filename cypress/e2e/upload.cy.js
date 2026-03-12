describe("Upload Clothing", () => {
  const FRONTEND_URL = "http://localhost:5173";
  const API_BASE =
    "https://thriftr-affjdacjg4fecuha.westus3-01.azurewebsites.net";
  const FIXTURE_PATH = "cypress/fixtures/hoodie.jpg";

  const username = "jgonz1604";
  const password = "qwerty12345";

  function loginAndGoToCloset() {
    cy.visit(`${FRONTEND_URL}/`);

    cy.contains("button", /^sign in$/i, { timeout: 10000 }).click();
    cy.get(".modal-overlay", { timeout: 10000 }).should("be.visible");

    cy.get(".modal-overlay").within(() => {
      cy.get("input").not('[type="password"]').first().clear().type(username);
      cy.get('input[type="password"]').first().clear().type(password);
      cy.contains("button", /^sign in$/i).click();
    });

    cy.get(".modal-overlay", { timeout: 10000 }).should("not.exist");

    cy.contains("a", /^closet$/i, { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.contains("My Closet", { timeout: 10000 }).should("be.visible");
  }

  context("Scenario #1: Successful upload sends POST /wardrobe", () => {
    beforeEach(() => {
      loginAndGoToCloset();
      cy.get("button.upload-open", { timeout: 10000 })
        .should("be.visible")
        .click();
      cy.get("form.upload-form").should("exist");
    });

    it("GIVEN the user has filled in all required fields", () => {
      cy.get("#name-select").type("Blue Denim Jacket");
      cy.get("#color-select").select("Blue");
      cy.get("#type-select").select("Jackets");
      cy.get('input[type="file"]').selectFile(FIXTURE_PATH, { force: true });
      cy.get('img[alt="preview"]').should("be.visible");
    });

    it('WHEN the user clicks "Upload" THEN the client sends POST /wardrobe with metadata', () => {
      // Broad stub: catch any request whose URL contains "cloudinary"
      // Do NOT wait for it (it may not happen depending on implementation).
      cy.intercept({ url: "**cloudinary**" }, (req) => {
        req.reply({
          statusCode: 200,
          body: {
            secure_url:
              "https://res.cloudinary.com/demo/image/upload/sample.jpg",
            public_id: "sample",
          },
        });
      });

      // Intercept your backend call and assert payload
      cy.intercept("POST", `${API_BASE}/wardrobe`, (req) => {
        expect(req.headers["content-type"]).to.match(/application\/json/i);
        expect(req.body).to.have.property("user_id");
        expect(req.body).to.have.property("name", "Blue Denim Jacket");
        expect(req.body).to.have.property("color", "Blue");
        expect(req.body).to.have.property("type", "Jackets");
        expect(req.body.tags).to.be.an("array");
        expect(req.body).to.have.property("img_url");
        expect(req.body).to.have.property("public_id");

        req.reply({ statusCode: 201, body: { _id: "fake123", ...req.body } });
      }).as("postWardrobe");

      // Fill fields
      cy.get("#name-select").type("Blue Denim Jacket");
      cy.get("#color-select").select("Blue");
      cy.get("#type-select").select("Jackets");
      cy.get('input[type="file"]').selectFile(FIXTURE_PATH, { force: true });

      cy.contains("button.upload-form-submit", "Upload").click();

      // Only wait for the requirement we care about
      cy.wait("@postWardrobe", { timeout: 20000 })
        .its("response.statusCode")
        .should("eq", 201);
    });
  });

  context("Scenario #2: Missing fields", () => {
    beforeEach(() => {
      loginAndGoToCloset();
      cy.get("button.upload-open", { timeout: 10000 })
        .should("be.visible")
        .click();
      cy.get("form.upload-form").should("exist");
    });

    it("GIVEN required fields are missing", () => {
      cy.get("#name-select").should("have.value", "");
      cy.get("#color-select").invoke("val").should("be.oneOf", ["", null]);
      cy.get("#type-select").invoke("val").should("be.oneOf", ["", null]);
      cy.get('img[alt="preview"]').should("not.exist");
    });

    it('WHEN "Upload" is clicked THEN show error and send no requests', () => {
      cy.intercept("POST", `${API_BASE}/wardrobe`).as("postWardrobe");

      cy.contains("button.upload-form-submit", "Upload").click();
      cy.contains(
        "Please fill in all required fields and add an image."
      ).should("be.visible");

      cy.wait(300);
      cy.get("@postWardrobe.all").then((calls) => {
        expect(calls).to.have.length(0);
      });
    });
  });
});
