import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import ResizeDetector from 'react-resize-detector';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { SynthTrack } from '../../synth/types';
import { useGlobalState } from '../../hooks/global-context-state';
import { SimpleTypedEvent, SimpleOnceOffEvent } from '../../synth/simple-event';

import { trackViewConsts } from './track-view-consts';
import { TrackLinkButton } from './track-link-button';
import { TrackTimeDivisions } from './track-time-divisions';
import { TrackNoteValues } from './track-note-values';
import { TrackNoteView } from './track-note-view';

const useStyles = makeStyles(theme => ({
  outer: {
    position: 'relative' as any,
    width: '100%',
    height: '100%'
  },
  toolbar: {
    padding: '5px',
    height: trackViewConsts.toolbarHeight + 'px',
    width: '100%'
  }
}));

interface TrackScrollInterface {
  onScrollY: SimpleTypedEvent<number>;
  onUnmount: SimpleOnceOffEvent;
  setScrollY: (value: number) => void;
}

const currentTracks: { [layoutUid: string]: TrackScrollInterface } = {};

export interface TrackViewComponentProps {
  layoutUid: string;
  track: SynthTrack;
}

const defaultNotePattern = [ 1,0,1,0, 1,1,0,1, 0,1,0,1 ];
const defaultNoteNames = [ 'C','C#','D','D#', 'E','F','F#','G', 'G#','A','A#','B' ];
const defaultNoteWidth = 20;
const defaultNoteHeight = 40;
const defaultTimeDivisions = 4;

export function TrackViewComponent (props: TrackViewComponentProps) {
  const classes = useStyles();
  
  const [onScrollYEvent] = useState(() => new SimpleTypedEvent<number>());
  const [scrollX, setScrollX] = useGlobalState(props.layoutUid, 'scrollX', 0);
  const [scrollY, setScrollY] = useGlobalState(props.layoutUid, 'scrollY', 0);
  const [scrollLinked, setScrollLinked] = useGlobalState(props.layoutUid, 'linked', null as string | null);

  const [notePattern, setNotePattern] = useGlobalState(props.layoutUid, 'pattern', defaultNotePattern);
  const [noteWidth, setNoteWidth] = useGlobalState(props.layoutUid, 'width', defaultNoteWidth);
  const [noteHeight, setNoteHeight] = useGlobalState(props.layoutUid, 'height', defaultNoteHeight);
  const [timeDivisions, setTimeDivisions] = useGlobalState(props.layoutUid, 'divisions', defaultTimeDivisions);
  const [trackMaxNotes, setTrackMaxNotes] = useState(4000);

  const [, dropRef] = useDrop({
    accept: 'trackLink',
    canDrop: item => (item as any).layoutUid !== props.layoutUid,
    drop: () => ({ layoutUid: props.layoutUid })
  });

  useEffect(() => {
    const obj = { onScrollY: onScrollYEvent, onUnmount: new SimpleOnceOffEvent(), setScrollY };
    currentTracks[props.layoutUid] = obj;
    return () => { delete currentTracks[props.layoutUid]; obj.onUnmount.trigger() };
  }, [props.layoutUid, onScrollYEvent, setScrollY]);
  
  useEffect(() => { onScrollYEvent.trigger(scrollY); }, [scrollY, onScrollYEvent]);

  useEffect(() => {
    if (!scrollLinked) { return; }
    var other = currentTracks[scrollLinked];
    if (other) {
      const unsubscribeThis = onScrollYEvent.subscribe(other.setScrollY);
      const unsubscribeOther = other.onScrollY.subscribe(setScrollY);
      const unsubscribeUnmount = other.onUnmount.subscribe(() => { unsubscribeThis(); unsubscribeOther(); setScrollLinked(null); });
      other.setScrollY(scrollY);
      return () => { unsubscribeThis(); unsubscribeOther(); unsubscribeUnmount(); };
    } else {
      const timeout = setTimeout(() => {
        setScrollLinked(null);
        setScrollLinked(scrollLinked);
      }, 1000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollLinked, onScrollYEvent, setScrollY]);

  const quantizedTrackHeight = (trackMaxNotes * noteHeight + 1) + 'px';

  return <ResizeDetector
    handleHeight
    render={({ height }) => (
      <div className={classes.outer} ref={dropRef}>
        <div className={classes.toolbar}>
          {scrollLinked ? 
            <Button variant="outlined" onClick={() => setScrollLinked(null)}>Unlink</Button> :
            <TrackLinkButton layoutUid={props.layoutUid} onLink={setScrollLinked} />
          }
        </div>
        <TrackNoteValues
          scrollX={scrollX}
          noteWidth={noteWidth}
          notePattern={notePattern} />
        <TrackTimeDivisions
          scrollY={scrollY}
          height={height}
          timeDivisionHeight={timeDivisions * noteHeight}
          quantizedTrackHeight={quantizedTrackHeight} />
        <TrackNoteView
          scrollX={scrollX}
          scrollY={scrollY}
          height={height}
          noteWidth={noteWidth}
          noteHeight={noteHeight}
          notePattern={notePattern}
          quantizedTrackHeight={quantizedTrackHeight}
          onScroll={(x, y) => { setScrollX(x); setScrollY(y); }} />
      </div>
    )}
  />;
}
