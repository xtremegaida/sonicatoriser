import React, { useState, useEffect } from 'react';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { useGlobalState } from '../hooks/global-context-state';
import globalContext from '../global-context';
import { LayoutComponentPropsBase } from '../types';
import { SynthObject } from './../synth/types';

const useStyles = makeStyles(theme => ({
  spacing: {
    marginLeft: theme.spacing(1)
  },
}));

export function LayoutProjectOutlineComponent (props: LayoutComponentPropsBase) {
  const [expanded, setExpanded] = useGlobalState(props.uid, 'expanded', []);
  const [tree, setTree] = useState(globalContext.synth.data);
  const [menu, setMenu] = useState({} as any);
  const classes = useStyles();

  const openMenu = (e: React.MouseEvent, type: string, selected?: SynthObject) => {
    e.preventDefault();
    setMenu({ element: e.target, type: type, selected: selected });
  };

  const closeMenu = () => {
    setMenu({});
  }
  
  useEffect(() => globalContext.synthEdit.onChange
    .subscribe(() => setTree(globalContext.synth.data)), [setTree]);
  
  return <React.Fragment>
    <TreeView
      expanded={expanded}
      onNodeToggle={(e, ids) => setExpanded(ids)}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="tracks" label="Tracks">
        {tree.tracks.map((track, index) => (
          <TreeItem nodeId={'track' + index} key={'track' + index} icon={<ListAltIcon />}
                    label={(track.name || 'Track') + ' (' + track.uid + ')'}
                    onDoubleClick={() => globalContext.showObjectView(track)}
                    onContextMenu={e => openMenu(e, 'track', track)}
                    onFocus={() => globalContext.onFocus.trigger(track.uid)} />
        ))}
        <TreeItem nodeId="addTrack" icon={<AddIcon />} label="Add Track"
                  onDoubleClick={() => globalContext.synthEdit.addTrack()}
                  onContextMenu={e => openMenu(e, 'track')} />
      </TreeItem>
      <TreeItem nodeId="chans" label="Channels">
        <TreeItem nodeId="addChan" icon={<AddIcon />} label="Add Channel" />
      </TreeItem>
    </TreeView>
    <Menu keepMounted
      anchorEl={menu.element}
      open={menu.element != null}
      onClose={closeMenu}
    >
      {menu.type === 'track' ? [
        (menu.selected ? [
          <MenuItem key="10" onClick={() => { globalContext.showObjectView(menu.selected); closeMenu(); }}>
            <ListAltIcon /><span className={classes.spacing}>View Track</span>
          </MenuItem>,
          <MenuItem key="11" onClick={() => { globalContext.onFocus.trigger(menu.selected.uid); closeMenu(); }}>
            <EditIcon /><span className={classes.spacing}>Edit Track Metadata</span>
          </MenuItem>,
          <MenuItem key="12" onClick={() => { globalContext.deleteObject(menu.selected); closeMenu(); }}>
            <DeleteIcon /><span className={classes.spacing}>Delete Track</span>
          </MenuItem>,
          <Divider key="13" />,
        ] : []),
        <MenuItem key="1" onClick={() => { globalContext.synthEdit.addTrack(); closeMenu(); }}>
          <AddIcon /><span className={classes.spacing}>Add Track</span>
        </MenuItem>,
      ] : null}
    </Menu>
  </React.Fragment>;
}
