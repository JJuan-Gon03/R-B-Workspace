describe("App Load", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/R-B-Workspace/");
  });

  it("loads the page and shows the THRIFTR brand name", () => {
    cy.contains("THRIFTR").should("be.visible");
  });

  it("shows the navbar with Sign in and Register buttons when logged out", () => {
    cy.contains("button", "Sign in").should("be.visible");
    cy.contains("button", "Register").should("be.visible");
  });

  it("shows the hero section headline", () => {
    cy.contains("Find Clothes").should("be.visible");
  });

  it("shows the How It Works section", () => {
    cy.contains("How It Works").should("be.visible");
  });

  it("shows the Get Started CTA button", () => {
    cy.contains("button", "Get Started").should("be.visible");
  });

  it("shows the footer with copyright info", () => {
    cy.contains("THRIFTR").should("be.visible");
    cy.contains("Contact").should("be.visible");
    cy.contains("About").should("be.visible");
  });

  it("opens the Sign In modal when Sign in is clicked", () => {
    cy.contains("button", "Sign in").click();
    cy.get(".modal").should("be.visible");
    cy.get(".modal").find("input[type='text']").should("exist");
    cy.get(".modal").find("input[type='password']").should("exist");
  });

  it("opens the Register modal when Register is clicked", () => {
    cy.contains("button", "Register").click();
    cy.get(".modal").should("be.visible");
    cy.get(".modal").contains("Create account").should("exist");
  });

  it("closes the auth modal when Cancel is clicked", () => {
    cy.contains("button", "Sign in").click();
    cy.get(".modal").should("be.visible");
    cy.get(".modal").contains("button", "Cancel").click();
    cy.get(".modal").should("not.exist");
  });

  it("navigates to the About page", () => {
    cy.contains("About").click();
    cy.contains("About THRIFTR").should("be.visible");
  });

  it("navigates to the Contact page", () => {
    cy.contains("Contact").click();
    cy.contains("Contact Us").should("be.visible");
  });

  it("redirects protected routes to homepage when not logged in", () => {
    cy.visit("http://localhost:5173/R-B-Workspace/#/wardrobe");
    cy.contains("Find Clothes").should("be.visible");

    cy.visit("http://localhost:5173/R-B-Workspace/#/shop");
    cy.contains("Find Clothes").should("be.visible");

    cy.visit("http://localhost:5173/R-B-Workspace/#/saved");
    cy.contains("Find Clothes").should("be.visible");

    cy.visit("http://localhost:5173/R-B-Workspace/#/my-items");
    cy.contains("Find Clothes").should("be.visible");
  });
});
