import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { LayoutComponentPropsBase } from '../types';

const useStyles = makeStyles(theme => ({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
}));

export interface TrackViewComponentProps extends LayoutComponentPropsBase {
  selectedTrackIndex: number;
}

export function TrackViewComponent (props: TrackViewComponentProps) {
  const classes = useStyles();
  
  return <div>f {props.selectedTrackIndex}</div>;
}
