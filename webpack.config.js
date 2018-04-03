const {resolve} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    template: "app/index.html",
  }),
];

module.exports = {
  mode: "development",

  entry: resolve(__dirname, "app/js/index.tsx"),
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "dist")
  },
  plugins: plugins,

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {test: /\.tsx?$/, loader: "ts-loader"},
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
      {test: /\.css$/, use: ['style-loader', 'css-loader']}
    ]
  },
};
