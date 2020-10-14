import {
  app,
  dialog,
  ipcMain,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
} from "electron";
import { shell } from "electron";

const isMac = process.platform === "darwin";
const isWin = process.platform === "win32";

const onClickAboutMenu = () => {
  dialog.showMessageBoxSync({
    type: "info",
    message: app.name,
    detail: `version: ${app.getVersion()}
commit: ${process.env.COMMIT}
Electron: ${process.versions.electron}
Chrome: ${process.versions.chrome}
Node.js: ${process.versions.node}
V8: ${process.versions.v8}
OS: ${process.platform} ${process.arch} ${process.getSystemVersion()}
`,
  });
};

const macosAppMenu: MenuItem | MenuItemConstructorOptions = {
  role: "appMenu",
  submenu: [
    {
      label: `${app.getName()}について`,
      click: onClickAboutMenu,
    },
    {
      type: "separator",
    },
    {
      label: `${app.getName()}を終了`,
      role: "quit",
    },
  ],
};

/**
 * ElectronのMenuの設定
 */
const templateMenu: Array<MenuItem | MenuItemConstructorOptions> = [
  ...(isMac ? [macosAppMenu] : []),
  {
    role: "fileMenu",
    label: "ファイル",
    submenu: [
      {
        label: "読み込む",
        accelerator: "CmdOrCtrl+O",
        click(_, browserWindow) {
          if (browserWindow && browserWindow.webContents) {
            browserWindow.webContents.send("on-click-menu-file-import");
          }
        },
      },
      ...(isWin
        ? ([{ type: "separator" }, { label: "終了", role: "quit" }] as const)
        : []),
    ],
  },
  {
    label: "ヘルプ",
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          await shell.openExternal("https://electronjs.org");
        },
      },
      { type: "separator" },
      {
        label: "開発ツール",
        role: "toggleDevTools",
      },
      {
        label: "リロード",
        accelerator: "CmdOrCtrl+R",
        click(item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload();
        },
      },
      ...(isWin
        ? ([
            { type: "separator" },
            {
              label: `${app.getName()}について`,
              role: "about",
            },
          ] as const)
        : []),
    ],
  },
];

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);
