const execSync = require("child_process").execSync;

const packageJson = require("../package.json");
const gitRev = execSync("git rev-parse --short HEAD", { encoding: "utf-8" });

module.exports = {
  version: `v${packageJson.version}.${gitRev}`,
  nodeEnv: process.env.NODE_ENV,
  noIndex: true,
  description:
    "君の推し組み合わせで歌が聴ける！複数の音声ファイルを同時再生してカップリングを楽しむ音楽プレイヤー",
  ogpSiteName: "かぷちゅうプレイヤー/Coupling Tune Player",
  ogpUrl: "https://coupling-tune-player.web.app",
  ogpImage: "https://coupling-tune-player.web.app/images/ogp.jpg",
};
