import React, { useState, useEffect } from 'react';

import { TreeView, TreeItem } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AddIcon from '@material-ui/icons/Add';
import { useGlobalState } from '../hooks/global-context-state';
import { LayoutComponentPropsBase } from '../types';
import globalContext from '../global-context';

const useStyles = makeStyles(theme => ({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
}));

export function LayoutProjectOutlineComponent (props: LayoutComponentPropsBase) {
  const [expanded, setExpanded] = useGlobalState(props.uid, 'expanded', []);
  const [tree, setTree] = useState(globalContext.synth.data);
  const classes = useStyles();
  
  useEffect(() => globalContext.synthEdit.onChange.subscribe(data => setTree({...data})), []);

  return <TreeView
    className={classes.root}
    expanded={expanded}
    onNodeToggle={(e, ids) => setExpanded(ids)}
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpandIcon={<ChevronRightIcon />}
  >
    <TreeItem nodeId="tracks" label="Tracks">
      {tree.tracks.map((track, index) => (
        <TreeItem nodeId={'track' + index} key={'track' + index} icon={<ListAltIcon />}
                  label={track.name || ('Track ' + (index + 1))}
                  onDoubleClick={() => globalContext.showTrackView(index)} />
      ))}
      <TreeItem nodeId="addTrack" icon={<AddIcon />} label="Add Track"
                onDoubleClick={() => globalContext.synthEdit.addTrack()} />
    </TreeItem>
    <TreeItem nodeId="chans" label="Channels">
      <TreeItem nodeId="addChan" icon={<AddIcon />} label="Add Channel" />
    </TreeItem>
  </TreeView>;
}
