export default {
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: "node", // ensures Node.js environment for backend testing
};
