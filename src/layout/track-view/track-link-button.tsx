import React from 'react';
import { useDrag } from 'react-dnd';
import Button from '@material-ui/core/Button';
import LinkIcon from '@material-ui/icons/Link';

import { showMessageDialog } from '../../components/confirm-dialog';

export function TrackLinkButton(props: {
  layoutUid: string;
  onLink: (layoutUid: string) => void;
}) {
  const [, dragRef] = useDrag({
    item: { type: 'trackLink', layoutUid: props.layoutUid },
    end: (item, monitor) => {
      const result = monitor.getDropResult();
      if (!result) { return; }
      if (props.onLink) { props.onLink(result.layoutUid); }
    }
  });
  return <Button variant="outlined" ref={dragRef}
    onClick={() => showMessageDialog('Link Scroll', 'Drag and drop this button on another track window to link the vertical scroll bars.')}>
    <LinkIcon />
  </Button>;
}
