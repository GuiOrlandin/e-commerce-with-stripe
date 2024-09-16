module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["/node_modules/"],
};
