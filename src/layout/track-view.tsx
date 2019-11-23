import React from 'react';

import { SynthTrack } from '../synth/types';

export interface TrackViewComponentProps {
  track: SynthTrack;
}

export function TrackViewComponent (props: TrackViewComponentProps) {
  return <div>f {props.track.uid}</div>;
}
