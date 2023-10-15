
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <Dialog
        open={props.openAlertDialog}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
              {
                props.children
              }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClickOnNo}  color="primary">
            منصرف می شم
          </Button>
          <Button onClick={props.handleClickOnYes} color="primary" autoFocus>
            موافقم
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
