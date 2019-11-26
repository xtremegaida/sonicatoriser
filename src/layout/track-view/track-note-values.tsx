import React, { useEffect, useRef, useState } from 'react';
import { trackViewConsts } from './track-view-consts';

const cssNoteValues = {
  position: 'absolute' as any,
  top: (trackViewConsts.toolbarHeight + 10) + 'px',
  height: (trackViewConsts.noteValueHeight + 1) + 'px',
  left: trackViewConsts.timeValueWidth + 'px',
  right: 0,
  overflowX: 'hidden' as any,
  overflowY: 'scroll' as any
};

const cssNoteValuesChild = {
  height: '100%',
  margin: 'auto'
};

export function TrackNoteValues(props: {
  noteWidth: number,
  notePattern: number[],
  scrollX: number
}) {
  const noteValueViewport = useRef<HTMLDivElement>(null);
  const [noteValueImage, setNoteValueImage] = useState('');

  useEffect(() => {
    setNoteValueImage(makeNoteValueImage(props.noteWidth, trackViewConsts.noteValueHeight, props.notePattern));
  }, [props.noteWidth, props.notePattern]);

  useEffect(() => {
    if (noteValueViewport.current) {
      noteValueViewport.current.scrollLeft = props.scrollX;
    }
  }, [props.scrollX]);

  return <div style={cssNoteValues} ref={noteValueViewport}>
    <div style={{...cssNoteValuesChild,
        backgroundImage: "url('" + noteValueImage + "')",
        width: (props.noteWidth * trackViewConsts.totalNotes + 1) + 'px'
      }}>
    </div>
  </div>;
}

function makeNoteValueImage(noteWidth: number, noteHeight: number, notePattern: number[]) {
  const canvas = document.createElement('canvas');
  canvas.width = noteWidth * trackViewConsts.totalNotes;
  canvas.height = noteHeight;
  const g = canvas.getContext('2d');
  if (g) {
    g.font = (noteWidth - 2) + 'px monospace';
    g.textBaseline = 'top';
    g.textAlign = 'right';
    for (var i = 0; i < trackViewConsts.totalNotes; i++) {
      g.fillStyle = notePattern[i % notePattern.length] ? '#eee' : '#ccc';
      g.fillRect(i * noteWidth, 0, noteWidth, noteHeight);
      g.fillStyle = '#000';
      g.fillRect(i * noteWidth, 0, 1, noteHeight);
      g.rotate(3.141592 / 2);
      g.fillText(i + '', noteHeight - 2, -noteWidth * (i + 1));
      g.resetTransform();
    }
    g.fillStyle = '#000';
    g.fillRect(0, 0, canvas.width, 1);
  }
  return canvas.toDataURL();
}
