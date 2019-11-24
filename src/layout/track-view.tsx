import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { SynthTrack } from '../synth/types';
import { useGlobalState } from '../hooks/global-context-state';
import { showMessageDialog } from '../components/confirm-dialog';
import { SimpleTypedEvent } from '../synth/simple-event';

const useStyles = makeStyles(theme => ({
  outer: {
    position: 'relative' as any,
    width: '100%',
    height: '100%'
  },
  viewport: {
    position: 'absolute' as any,
    top: '32px',
    left: 0,
    width: '100%',
    bottom: 0,
    overflow: 'auto'
  },
  viewportChild: {
    height: '1000px',
    margin: 'auto'
  }
}));

interface TrackScrollInterface {
  onScrollY: SimpleTypedEvent<number>;
  setScrollY: (value: number) => void;
}

const currentTracks: { [layoutUid: string]: TrackScrollInterface } = {};

export interface TrackViewComponentProps {
  layoutUid: string;
  track: SynthTrack;
}

const defaultNotePattern = [ 0,1,0,1, 1,0,1,0, 1,0,1,1 ];
const defaultNoteWidth = 20;
const defaultNoteHeight = 40;

export function TrackViewComponent (props: TrackViewComponentProps) {
  const classes = useStyles();
  const viewport = useRef<HTMLDivElement>(null);
  const [onScrollYEvent] = useState(() => new SimpleTypedEvent<number>());
  const [scrollX, setScrollX] = useGlobalState(props.layoutUid, 'scrollX', 0);
  const [scrollY, setScrollY] = useGlobalState(props.layoutUid, 'scrollY', 0);
  const [scrollLinked, setScrollLinked] = useGlobalState(props.layoutUid, 'linked', null as string | null);
  const [notePattern, setNotePattern] = useGlobalState(props.layoutUid, 'pattern', defaultNotePattern);
  const [noteWidth, setNoteWidth] = useGlobalState(props.layoutUid, 'width', defaultNoteWidth);
  const [noteHeight, setNoteHeight] = useGlobalState(props.layoutUid, 'height', defaultNoteHeight);
  const [noteImage, setNoteImage] = useState('');

  const [, dropRef] = useDrop({
    accept: 'trackLink',
    canDrop: item => (item as any).layoutUid !== props.layoutUid,
    drop: () => ({ layoutUid: props.layoutUid })
  });

  useEffect(() =>
    setNoteImage(makeNoteLayoutImage(noteWidth, noteHeight, notePattern)),
    [noteWidth, noteHeight, notePattern]);

  useEffect(() => {
    currentTracks[props.layoutUid] = { onScrollY: onScrollYEvent, setScrollY };
    return () => { delete currentTracks[props.layoutUid]; };
  }, [props.layoutUid, onScrollYEvent, setScrollY]);
  
  useEffect(() => {
    if (viewport.current) { viewport.current.scrollLeft = scrollX; }
  }, [scrollX]);

  useEffect(() => {
    if (viewport.current) { viewport.current.scrollTop = scrollY; }
    onScrollYEvent.trigger(scrollY);
  }, [scrollY, onScrollYEvent]);

  useEffect(() => {
    if (!scrollLinked) { return; }
    var other = currentTracks[scrollLinked];
    if (other) {
      const unsubscribe = onScrollYEvent.subscribe(other.setScrollY);
      const unsubscribeOther = other.onScrollY.subscribe(setScrollY);
      other.setScrollY(scrollY);
      return () => { unsubscribe(); unsubscribeOther(); };
    } else {
      const timeout = setTimeout(() => {
        setScrollLinked(null);
        setScrollLinked(scrollLinked);
      }, 1000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLinked, onScrollYEvent, setScrollY]);

  const updateScroll = () => {
    if (!viewport.current) { return; }
    setScrollY(viewport.current.scrollTop);
    setScrollX(viewport.current.scrollLeft);
  };

  return <div className={classes.outer} ref={dropRef}>
    {scrollLinked ? 
      <Button variant="outlined" onClick={() => setScrollLinked(null)}>Unlink Scroll</Button> :
      <TrackLinkButton layoutUid={props.layoutUid} onLink={setScrollLinked} />
    }
    <div className={classes.viewport} ref={viewport} onScroll={updateScroll}>
      <div className={classes.viewportChild} style={{
        backgroundImage: "url('" + noteImage + "')",
        width: (noteWidth * 128 + 1) + 'px',
        height: (Math.ceil(1000 / noteHeight) * noteHeight + 1) + 'px'
      }}>
      </div>
    </div>
  </div>;
}

interface TrackLinkButtonProps {
  layoutUid: string;
  onLink: (layoutUid: string) => void;
}

function TrackLinkButton(props: TrackLinkButtonProps) {
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
    Link Scroll
  </Button>;
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
