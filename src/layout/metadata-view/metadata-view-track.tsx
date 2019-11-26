import React from 'react';

import TextField from '@material-ui/core/TextField';

import { SynthTrack } from '../../synth/types';

const fullWidth = { width: '100%' };

export function MetadataViewTrack (props: {
  objEdit: SynthTrack;
  onObjEditChanged: (objEdit: SynthTrack) => void;
  onFinishChanges?: () => void;
}) {
  return <React.Fragment>
    <TextField label="Name" style={fullWidth} onBlur={props.onFinishChanges} value={props.objEdit.name || ''}
      onChange={e => props.onObjEditChanged({...props.objEdit, name: e.target.value})} />
  </React.Fragment>;
}
