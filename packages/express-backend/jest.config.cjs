module.exports = {
  testEnvironment: "node",
  transform: {}, // no Babel for now
  // Look for tests in __tests__ folder
  testMatch: ["**/__tests__/**/*.test.[jt]s"],
  moduleFileExtensions: ["js", "mjs", "json"],
};
