import React, { useEffect, useRef } from 'react';
import { trackViewConsts } from './track-view-consts';

const cssTimeValues = {
  position: 'absolute' as any,
  top: (trackViewConsts.toolbarHeight + trackViewConsts.noteValueHeight + 11) + 'px',
  bottom: 0,
  left: 0,
  width: trackViewConsts.timeValueWidth + 'px',
  overflow: 'hidden' as any
};

const cssTimeValuesChild = {
  position: 'absolute' as any,
  left: 0,
  width: '100%',
  borderTop: '1px solid black'
};

export function TrackTimeDivisions(props: {
  height: number,
  scrollY: number,
  timeDivisionHeight: number,
  quantizedTrackHeight: string
}) {
  const timeValueViewport = useRef<HTMLDivElement>(null);

  const timeDivisionCount = Math.ceil(props.height / props.timeDivisionHeight) + 2;
  const timeDivisionOffset = Math.floor(props.scrollY / props.timeDivisionHeight) - 1;

  const divisions = [];
  for (var i = 0; i < timeDivisionCount; i++) {
    divisions.push(<div key={timeDivisionOffset + i} style={{...cssTimeValuesChild,
      top: (timeDivisionOffset + i) * props.timeDivisionHeight + 'px',
      height: props.timeDivisionHeight + 'px'}}>
      {timeDivisionOffset + i}
    </div>);
  }

  useEffect(() => {
    if (timeValueViewport.current) {
      timeValueViewport.current.scrollTop = props.scrollY;
    }
  }, [props.scrollY]);

  return <div style={cssTimeValues} ref={timeValueViewport}>
    <div style={{ width: '100%', height: props.quantizedTrackHeight }}>
      {divisions}
    </div>
  </div>;
}
