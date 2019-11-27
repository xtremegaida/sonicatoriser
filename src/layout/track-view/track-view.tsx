import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import ResizeDetector from 'react-resize-detector';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import EditIcon from '@material-ui/icons/Edit';

import { SynthTrack } from '../../synth/types';
import { useGlobalState } from '../../hooks/global-context-state';
import { SimpleTypedEvent, SimpleOnceOffEvent } from '../../synth/simple-event';
import globalContext from '../../global-context';

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
  },
  spaceLeft: {
    marginLeft: '5px'
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

export function TrackViewComponent (props: TrackViewComponentProps) {
  const classes = useStyles();
  
  const [onScrollYEvent] = useState(() => new SimpleTypedEvent<number>());
  const [scrollX, setScrollX] = useGlobalState(props.layoutUid, 'scrollX', 0);
  const [scrollY, setScrollY] = useGlobalState(props.layoutUid, 'scrollY', 0);
  const [scrollLinked, setScrollLinked] = useGlobalState(props.layoutUid, 'linked', null as string | null);

  const [notePattern, setNotePattern] = useGlobalState(props.layoutUid, 'pattern', trackViewConsts.defaultNotePattern);
  const [noteLength, setNoteLength] = useState(trackViewConsts.defaultNoteLength);
  const [notesPerDivision, setNotesPerDivision] = useState(trackViewConsts.defaultNotesPerTimeDivision);
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

  if ((props.track.notesPerDivision || trackViewConsts.defaultNotesPerTimeDivision) !== notesPerDivision) {
    setNotesPerDivision(props.track.notesPerDivision || trackViewConsts.defaultNotesPerTimeDivision);
  }
  if ((props.track.noteLength || trackViewConsts.defaultNoteLength) !== noteLength) {
    setNoteLength(props.track.noteLength || trackViewConsts.defaultNoteLength);
  }

  const quantizedTrackHeight = (trackMaxNotes * noteLength * trackViewConsts.noteHeight + 1) + 'px';

  return <ResizeDetector
    handleHeight
    render={({ height }) => (
      <div className={classes.outer} ref={dropRef}>
        <div className={classes.toolbar}>
          {scrollLinked ? 
            <Button variant="outlined" onClick={() => setScrollLinked(null)}><LinkOffIcon /></Button> :
            <TrackLinkButton layoutUid={props.layoutUid} onLink={setScrollLinked} />
          }
          <Button className={classes.spaceLeft} variant="outlined"
            onClick={() => globalContext.editObject(props.track)}><EditIcon /></Button>
        </div>
        <TrackNoteValues
          scrollX={scrollX}
          noteWidth={trackViewConsts.noteWidth}
          notePattern={notePattern} />
        <TrackTimeDivisions
          scrollY={scrollY}
          height={height}
          timeDivisionHeight={notesPerDivision * noteLength * trackViewConsts.noteHeight}
          quantizedTrackHeight={quantizedTrackHeight} />
        <TrackNoteView
          scrollX={scrollX}
          scrollY={scrollY}
          height={height}
          noteWidth={trackViewConsts.noteWidth}
          noteHeight={trackViewConsts.noteHeight * noteLength}
          notePattern={notePattern}
          quantizedTrackHeight={quantizedTrackHeight}
          onScroll={(x, y) => { setScrollX(x); setScrollY(y); }} />
      </div>
    )}
  />;
}
