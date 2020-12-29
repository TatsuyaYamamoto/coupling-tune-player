const execSync = require("child_process").execSync;

const packageJson = require("../package.json");
const gitRev = execSync("git rev-parse --short HEAD", { encoding: "utf-8" });

module.exports = {
  version: `v${packageJson.version}.${gitRev}`,
  nodeEnv: process.env.NODE_ENV,
  noIndex: true,
  description: "同時に２個の音声ファイルを再生して○x○を楽しむ音楽プレイヤー",
  ogpSiteName: "かぷちゅうプレイヤー/Coupling Tune Player",
  ogpUrl: "http://coupling-tune-player.web.app",
  ogpImage:
    "http://coupling-tune-player.web.app/images/platform_screenshot_web.jpg",
};
