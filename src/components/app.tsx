import React from 'react';

import { TreeView, TreeItem } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useGlobalState } from '../global-context-state';

const StyledTreeView = styled(TreeView)({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
});

export function AppTest (props: any) {
  const [count, setCount] = useGlobalState(props.uid, 'count', 0);
  const [expanded, setExpanded] = useGlobalState(props.uid, 'nodes', []);
  return <StyledTreeView
    expanded={expanded}
    onNodeToggle={(e, ids) => setExpanded(ids)}
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpandIcon={<ChevronRightIcon />}
  >
    <TreeItem nodeId="1" label={"Applications" + count} onClick={() => setCount(count + 1)}>
      <TreeItem nodeId="2" label="Calendar" />
      <TreeItem nodeId="3" label="Chrome" />
      <TreeItem nodeId="4" label="Webstorm" />
    </TreeItem>
    <TreeItem nodeId="5" label="Documents">
      <TreeItem nodeId="6" label="Material-UI">
        <TreeItem nodeId="7" label="src">
          <TreeItem nodeId="8" label="index.js" />
          <TreeItem nodeId="9" label="tree-view.js" />
        </TreeItem>
      </TreeItem>
    </TreeItem>
  </StyledTreeView>;
}
