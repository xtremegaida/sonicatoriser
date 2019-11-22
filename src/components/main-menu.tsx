import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { MenuButton } from './menu-button';
import CreateIcon from '@material-ui/icons/Create';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/SaveAltRounded';
import globalContext from '../global-context';

const useStyles = makeStyles(theme => ({
  spacing: {
    marginRight: theme.spacing(2),
  }
}));

export function MainMenu () {
  const classes = useStyles();
  return <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" className={classes.spacing}>
        Sonicatoriser
      </Typography>
      <MenuButton name="File" items={[
        //TODO: add confirm dialog
        { name: <span><CreateIcon className={classes.spacing} /> New</span>, onClick: () => globalContext.fileNew() },
        { divider: true },
        { name: <span><FolderOpenIcon className={classes.spacing} /> Quick Load</span>, onClick: () => globalContext.fileQuickLoad() },
        { name: <span><SaveIcon className={classes.spacing} /> Quick Save</span>, onClick: () => globalContext.fileQuickSave() },
        { divider: true },
        { name: <span><FolderOpenIcon className={classes.spacing} /> Open From File</span>, onClick: () => globalContext.fileLoad() },
        { name: <span><SaveIcon className={classes.spacing} /> Save To File</span>, onClick: () => globalContext.fileSave() },
      ]} />
      <MenuButton name="View" items={[
        { name: <span><CreateIcon className={classes.spacing} /> New</span> },
        { name: <span><FolderOpenIcon className={classes.spacing} /> Open</span> },
        { name: <span><SaveIcon className={classes.spacing} /> Save</span> },
      ]} />
    </Toolbar>
  </AppBar>;
}
