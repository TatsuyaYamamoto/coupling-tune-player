module.exports = {
  packagerConfig: {
    name: "coupling-tune-player-desktop",
    // The extension is automatically added for each platform.
    // https://stackoverflow.com/questions/48790003/setting-platform-dependant-icon-via-electron-forge-electronpackagerconfig
    icon: "./icon",
  },
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "coupling-tune-player-desktop",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    [
      "@electron-forge/plugin-webpack",
      {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.tsx",
              name: "main_window",
              preload: { js: "./src/preload.ts" },
            },
          ],
        },
        port: 3001,
      },
    ],
  ],
};
