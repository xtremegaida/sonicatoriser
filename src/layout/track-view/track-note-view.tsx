import React, { useEffect, useRef, useState } from 'react';
import { trackViewConsts } from './track-view-consts';

const cssNoteView = {
  position: 'absolute' as any,
  top: (trackViewConsts.toolbarHeight + trackViewConsts.noteValueHeight + 11) + 'px',
  left: trackViewConsts.timeValueWidth + 'px',
  right: 0,
  bottom: 0,
  overflow: 'auto' as any
};

const cssNoteViewChild = {
  margin: 'auto'
};

export function TrackNoteView(props: {
  height: number,
  noteWidth: number,
  noteHeight: number,
  notePattern: number[],
  scrollX: number,
  scrollY: number,
  quantizedTrackHeight: string,
  onScroll: (scrollX: number, scrollY: number) => void;
}) {
  const noteViewport = useRef<HTMLDivElement>(null);
  const [noteImage, setNoteImage] = useState('');
  const updateScroll = () => {
    if (noteViewport.current) {
      props.onScroll(noteViewport.current.scrollLeft, noteViewport.current.scrollTop);
    }
  };

  useEffect(() => {
    setNoteImage(makeNoteLayoutImage(props.noteWidth, props.noteHeight, props.notePattern));
  }, [props.noteWidth, props.noteHeight, props.notePattern]);

  useEffect(() => {
    if (noteViewport.current) {
      noteViewport.current.scrollLeft = props.scrollX;
      noteViewport.current.scrollTop = props.scrollY;
    }
  }, [props.scrollX, props.scrollY]);

  return <div style={cssNoteView} ref={noteViewport} onScroll={updateScroll}>
    <div style={{...cssNoteViewChild,
      backgroundImage: "url('" + noteImage + "')",
      width: (props.noteWidth * trackViewConsts.totalNotes + 1) + 'px',
      height: props.quantizedTrackHeight
    }}>
    </div>
  </div>;
}

function makeNoteLayoutImage(noteWidth: number, noteHeight: number, notePattern: number[]) {
  const canvas = document.createElement('canvas');
  canvas.width = notePattern.length * noteWidth;
  canvas.height = noteHeight;
  const g = canvas.getContext('2d');
  if (g) {
    for (var i = 0; i < notePattern.length; i++) {
      g.fillStyle = notePattern[i] ? '#fff' : '#eee';
      g.fillRect(i * noteWidth, 0, noteWidth, noteHeight);
      g.fillStyle = '#000';
      g.fillRect(i * noteWidth, 0, 1, noteHeight);
    }
    g.fillStyle = '#000';
    g.fillRect(0, 0, canvas.width, 1);
  }
  return canvas.toDataURL();
}
