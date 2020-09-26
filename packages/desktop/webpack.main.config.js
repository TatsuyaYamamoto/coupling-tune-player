const { execSync } = require("child_process");

const webpack = require("webpack");

const commit = execSync("git rev-parse --short HEAD", { encoding: "utf-8" });

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/index.ts",
  // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".json"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.COMMIT": JSON.stringify(commit),
    }),
  ],
};
