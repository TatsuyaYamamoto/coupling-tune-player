import React, { FC } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";

import {
  LibraryMusic as LibraryIcon,
  PlaylistPlay as PlaylistIcon,
  Help as HelpIcon,
} from "@material-ui/icons";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
  })
);

const playerMenuItems = [
  { id: "library", label: "ライブラリ", icon: <LibraryIcon /> },
  { id: "playlist", label: "プレイリスト", icon: <PlaylistIcon /> },
] as const;

const appMenuItems = [
  { id: "help", label: "ヘルプ", icon: <HelpIcon /> },
] as const;

export interface DrawerProps {
  onClickMenu: (item: "playlist" | "library" | "help") => void;
}

const Drawer: FC<DrawerProps> = (props) => {
  const { onClickMenu, children } = props;
  const classes = useStyles();

  const onClickMenuListItem = (
    value: "playlist" | "library" | "help"
  ) => () => {
    onClickMenu(value);
  };

  return (
    <MuiDrawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar}>
        {`Couple Tune Player/かぷちゅうプレイヤー`}
      </div>
      <List>
        {playerMenuItems.map(({ id, label, icon }) => (
          <ListItem button key={id} onClick={onClickMenuListItem(id)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {appMenuItems.map(({ id, label, icon }) => (
          <ListItem button key={id} onClick={onClickMenuListItem(id)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </MuiDrawer>
  );
};

export default Drawer;
