import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';

export function MenuButton (props: { name: string, items: { name?: any, divider?: boolean, onClick?: () => void; }[] }) {
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(prevOpen => !prevOpen);
  const handleClose = () => setOpen(false);

  return <React.Fragment>
    <Button color="inherit" onClick={handleToggle} ref={anchorRef}>{props.name}</Button>
    <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList autoFocusItem={open}>
                {props.items.map((item, index) => (item.divider ? <Divider key={index} /> :
                  <MenuItem key={index} onClick={() => { item.onClick && item.onClick(); handleClose(); }}>
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  </React.Fragment>
}
