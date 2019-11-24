import React, { useState, useEffect } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import { SimpleTypedEvent } from '../synth/simple-event';

interface ConfirmDialogData {
  title: string;
  message: string;
  resolveButtons?: string[];
  rejectButtons?: string[];
  resolve: (value: string) => void;
  reject: (value: string) => void;
}

export function showConfirmDialog(title: string, message: string) {
  return new Promise<string>((resolve, reject) => {
    onConfirm.trigger({
      title, message, resolve, reject,
      resolveButtons: ['Confirm'],
      rejectButtons: ['Cancel']
    });
  });
};

export function showMessageDialog(title: string, message: string) {
  return new Promise<string>((resolve, reject) => {
    onConfirm.trigger({ title, message, resolve, reject, resolveButtons: ['OK'] });
  });
};

export function showDialog(title: string, message: string, resolveButtons?: string[], rejectButtons?: string[]) {
  return new Promise<string>((resolve, reject) => {
    onConfirm.trigger({ title, message, resolve, reject, resolveButtons, rejectButtons });
  });
};

const onConfirm = new SimpleTypedEvent<ConfirmDialogData>();

export function ConfirmDialog() {
  const [dialogData, setDialogData] = useState(null as ConfirmDialogData | null);
  const handleReject = (value: string) => { if (dialogData) { dialogData.reject(value); } setDialogData(null); };
  const handleResolve = (value: string) => { if (dialogData) { dialogData.resolve(value); } setDialogData(null); };
  useEffect(() => onConfirm.subscribe(setDialogData), [setDialogData]);
  return <Dialog open={!!dialogData} onClose={() => handleReject('')} aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">{(dialogData && dialogData.title) || 'Confirm'}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {dialogData && dialogData.message}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <span>
        {dialogData && dialogData.rejectButtons && dialogData.rejectButtons.map((value, index) => (
          <Button onClick={() => handleReject(value)} key={index} color="primary">{value}</Button>
        ))}
      </span>
      <span>
        {dialogData && dialogData.resolveButtons && dialogData.resolveButtons.map((value, index) => (
          <Button onClick={() => handleResolve(value)} key={index} color="primary">{value}</Button>
        ))}
      </span>
    </DialogActions>
  </Dialog>;
}
