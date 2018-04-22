const {resolve} = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const production = process.env.NODE_ENV === 'production';

const htmlParams = {
  title: "DEV かぷちゅうプレイヤー/Coupling Tune Player",
  trackingCode: "UA-64858827-8",
  siteName: "かぷちゅうプレイヤー/Coupling Tune Player",
  description: "同時に２個の音声ファイルを再生して○x○を楽しむ音楽プレイヤー",
  url: "https://apps.sokontokoro-factory.net/coupling-tune-player/",
  ogImage: "./assets/og.jpg",
};

production && Object.assign(htmlParams, {
  title: "かぷちゅうプレイヤー/Coupling Tune Player -そこんところ工房-",
  trackingCode: "UA-64858827-9"
});

const plugins = [
  new HtmlWebpackPlugin({
    templateParameters: htmlParams,
    template: "app/index.ejs",
    hash: true,
  }),
];

const mode = production ? "production" : "development";

module.exports = {
  mode,

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
