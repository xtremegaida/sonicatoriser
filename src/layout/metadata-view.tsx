import React, { useEffect, useState } from 'react';
import { LayoutComponentPropsBase } from '../types';
import { useGlobalState } from '../hooks/global-context-state';
import globalContext from '../global-context';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(theme => ({
  inputField: {
    width: '100%'
  },
  idLabel: {
    display: 'inline-block',
    marginTop: '6px',
    marginRight: theme.spacing(1)
  },
  padding: {
    padding: '10px'
  }
}));

export function MetadataViewComponent (props: LayoutComponentPropsBase) {
  const classes = useStyles();
  const [selectedUid, setSelectedUid] = useGlobalState(props.uid, 'uid', 0);
  const [obj, setObj] = useState(() => globalContext.synth.getByUid(selectedUid));
  const [objEdit, setObjEdit] = useState(() => ({...obj} as any));
  const onChanged = () => globalContext.synthEdit.changed(objEdit);
  
  useEffect(() => globalContext.onFocus.subscribe(setSelectedUid), [setSelectedUid]);
  useEffect(() => {
    setObj(globalContext.synth.getByUid(selectedUid));
    return globalContext.synthEdit.onChange.subscribe(() => setObj(globalContext.synth.getByUid(selectedUid)));
  }, [selectedUid, setObj]);
  useEffect(() => setObjEdit({...obj}), [obj, setObjEdit]);

  if (!obj) {
    if (props.glContainer.title !== 'Metadata') { props.glContainer.setTitle('Metadata'); }
    return <div className={classes.padding}>Nothing selected.</div>;
  } else {
    const titleName = 'Metadata: ' + obj.type + ' (' + obj.uid + ')';
    if (props.glContainer.title !== titleName) { props.glContainer.setTitle(titleName); }
    return <div className={classes.padding}>
      <div>
        <span className={classes.idLabel}>{obj.type} ({selectedUid})</span>
        <span>
          <Button onClick={() => globalContext.deleteObject(obj)} color="primary"><DeleteIcon/></Button>
        </span>
      </div>
      {obj.type === 'track' ? ([
        <div key="1">
          <TextField label="Name" onBlur={onChanged} value={objEdit.name || ''}
            onChange={e => setObjEdit({...objEdit, name: e.target.value})} className={classes.inputField} />
        </div>
      ]) : null}
    </div>;
  }
}
