import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { LayoutComponentPropsBase } from '../types';
import { TrackViewComponent } from './track-view';
import { SynthTrack } from './../synth/types';
import globalContext from '../global-context';

export interface SynthObjectViewComponentProps extends LayoutComponentPropsBase {
  selectedUid: number;
}

export function SynthObjectViewComponent (props: SynthObjectViewComponentProps) {
  const [obj, setObj] = useState(() => globalContext.synth.getByUid(props.selectedUid));
  
  useEffect(() => globalContext.synthEdit.onChange.subscribe(() => {
    const newObj = globalContext.synth.getByUid(props.selectedUid);
    if (!newObj) { props.glContainer.close(); } else { setObj(newObj); }
    // props will never change on this component after mounting
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [props.selectedUid, setObj]);

  if (!obj) {
    return <div>Object with UID {props.selectedUid} not found.</div>;
  } else {
    var title: string;
    switch (obj.type) {
      case 'track':
        title = 'Track: ' + ((obj as SynthTrack).name || '') + ' (' + obj.uid + ')';
        if (props.glContainer.title !== title) { props.glContainer.setTitle(title); }
        return <DndProvider backend={HTML5Backend}>
          <TrackViewComponent layoutUid={props.uid} track={obj as SynthTrack} />
        </DndProvider>;
      default:
        return <div>No supported viewer for object type: {obj.type}.</div>;
    }
  }
}
