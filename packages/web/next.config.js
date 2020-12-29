// https://mdxjs.com/getting-started/next
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
});

const env = Object.assign({}, require("./config/default"));

if (process.env.NODE_ENV === "production") {
  Object.assign(env, require("./config/pro"));
}

if (process.env.NODE_ENV === "development") {
  Object.assign(env, require("./config/dev"));
}

module.exports = withMDX({
  env,
  pageExtensions: ["tsx", "mdx"],
});
