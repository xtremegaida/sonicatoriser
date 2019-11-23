import React, { useState, useEffect } from 'react';

import { SynthObject } from '../synth/types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import globalContext from '../global-context';

export function DeleteConfirmDialog() {
  const [deleteObject, setDeleteObject] = useState(null as SynthObject | null);
  const handleClose = () => setDeleteObject(null);
  const handleDelete = () => {
    if (deleteObject) { globalContext.deleteObject(deleteObject, true); }
    handleClose();
  };
  
  useEffect(() => globalContext.onDeleteConfirm.subscribe(setDeleteObject), [setDeleteObject]);

  return <Dialog open={!!deleteObject} onClose={handleClose} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Delete Item</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Permanently delete object?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">Cancel</Button>
      <Button onClick={handleDelete} color="primary">Delete</Button>
    </DialogActions>
  </Dialog>;
}
