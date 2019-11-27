import React from 'react';

import TextField from '@material-ui/core/TextField';

import { SynthTrack } from '../../synth/types';
import { trackViewConsts } from '../track-view/track-view-consts';

const fullWidth = { width: '100%' };

export function MetadataViewTrack (props: {
  objEdit: SynthTrack;
  onObjEditChanged: (objEdit: SynthTrack) => void;
  onFinishChanges?: () => void;
}) {
  return <div className="selectable">
    
    <TextField label="Name" style={fullWidth} onBlur={props.onFinishChanges} value={props.objEdit.name || ''}
      onChange={e => props.onObjEditChanged({...props.objEdit, name: e.target.value})} />

    <TextField label="Notes Per Division" style={fullWidth} onBlur={props.onFinishChanges}
      value={(props.objEdit.notesPerDivision || '') + ''} placeholder={trackViewConsts.defaultNotesPerTimeDivision + ''}
      onChange={e => !e.target.value ? props.onObjEditChanged({...props.objEdit, notesPerDivision: undefined}) :
        !isNaN(+e.target.value) && props.onObjEditChanged({...props.objEdit, notesPerDivision: +e.target.value})} />

    <TextField label="Note Length" style={fullWidth} onBlur={props.onFinishChanges}
      value={(props.objEdit.noteLength || '') + ''} placeholder={trackViewConsts.defaultNoteLength + ''}
      onChange={e => !e.target.value ? props.onObjEditChanged({...props.objEdit, noteLength: undefined}) :
        !isNaN(+e.target.value) && props.onObjEditChanged({...props.objEdit, noteLength: +e.target.value})} />

  </div>;
}
