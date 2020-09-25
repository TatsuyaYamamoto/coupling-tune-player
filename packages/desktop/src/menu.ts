import { app, Menu, MenuItem, MenuItemConstructorOptions } from "electron";
import { shell } from "electron";

/**
 * 開発用メニューアイテム
 * packageされていない状態のときに展開される
 */
const devMenuItem: Array<MenuItemConstructorOptions | MenuItem> = app.isPackaged
  ? []
  : [
      {
        label: "開発",
        submenu: [
          {
            label: "Dev Tool",
            role: "toggleDevTools",
          },
          {
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click(item, focusedWindow) {
              if (focusedWindow) focusedWindow.reload();
            },
          },
        ],
      },
    ];

/**
 * ElectronのMenuの設定
 */
const templateMenu: Array<MenuItemConstructorOptions | MenuItem> = [
  {
    role: "appMenu",
    submenu: [
      {
        label: `${app.getName()}について`,
        role: "about",
      },
      {
        type: "separator",
      },
      {
        label: `${app.getName()}を終了`,
        role: "quit",
      },
    ],
  },
  ...devMenuItem,
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
    ],
  },
];

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);
