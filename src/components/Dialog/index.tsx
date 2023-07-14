import React from "react";
import { IconButton, Typography, Theme } from "@mui/material";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: '1rem'
      // padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: '1rem',
      top: '0.4rem'
      // right: theme.spacing(1),
      // top: theme.spacing(1),
      // color: theme.palette.grey[500],
    },
  });

const DialogTitle = withStyles(styles)((props: any) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      <Typography >{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
          size="large">
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    // padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    // padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export { DialogTitle, DialogContent, DialogActions };
