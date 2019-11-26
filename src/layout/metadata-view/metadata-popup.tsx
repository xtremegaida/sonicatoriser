import React, { useEffect, useState } from 'react';
import globalContext from '../../global-context';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';

import { MetadataViewTrack } from './metadata-view-track';

export function MetadataPopup () {
  const [selectedUid, setSelectedUid] = useState(0);
  const [obj, setObj] = useState(() => globalContext.synth.getByUid(selectedUid));
  const [objEdit, setObjEdit] = useState(() => ({...obj} as any));
  const handleClose = () => { setSelectedUid(0); };
  
  useEffect(() => globalContext.onEdit.subscribe(setSelectedUid), [setSelectedUid]);
  useEffect(() => {
    setObj(globalContext.synth.getByUid(selectedUid));
    return globalContext.synthEdit.onChange.subscribe(() => setObj(globalContext.synth.getByUid(selectedUid)));
  }, [selectedUid, setObj]);
  useEffect(() => setObjEdit({...obj}), [obj, setObjEdit]);

  return <Dialog open={!!selectedUid} onClose={handleClose} aria-labelledby="edit-dialog-title">
    <DialogTitle id="edit-dialog-title">Edit: {obj && obj.type} ({selectedUid})</DialogTitle>
    <DialogContent>
      <div style={{width: '500px'}}>
        {obj && obj.type === 'track' ? <MetadataViewTrack objEdit={objEdit} onObjEditChanged={setObjEdit} /> : null}
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary"><CancelIcon /> Cancel</Button>
      <Button onClick={() => globalContext.deleteObject(obj).then(handleClose)} color="primary"><DeleteIcon/> Delete</Button>
      <Button onClick={() => { globalContext.synthEdit.changed(objEdit); handleClose(); }} color="primary"><SaveIcon /> Save</Button>
    </DialogActions>
  </Dialog>;
}
