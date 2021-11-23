module.exports = {
  rules: {
    "no-mixed-spaces-and-tabs": 0, // disable rule
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },
  parser: "babel-eslint",
};
