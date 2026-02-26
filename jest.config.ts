module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 20000, // sets timeout for all tests to 20 seconds
  // Force all tests to run one at a time
  maxWorkers: 1, // ← Simple fix, but slower
};
