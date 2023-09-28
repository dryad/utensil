import { IconButton, Theme, Dialog, styled, TextField, Button } from "@mui/material";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogContent from "@mui/material/DialogContent";
import MuiDialogActions from "@mui/material/DialogActions";
import { CloseIcon } from "assets/icons/svg";
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import { THEME_COLORS } from "constants/colors";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      color: '#111827',
      fontSize: '1.125rem',
      fontWeight: '500',
      padding: '0'
    },
    closeButton: {
      position: "absolute",
      right: '10px',
      top: '10px'
    },
  });

const DialogTitle = withStyles(styles)((props: any) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle className={classes.root} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
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
    padding: 0,
  },
}))(MuiDialogActions);

const DialogWindow = withStyles(styles)((props: any) => {
  const { children, classes, onClose, width, ...other } = props;
  return (
    <Dialog 
      slotProps={{ backdrop: { style: { backgroundColor: 'rgba(75, 85, 99, 0.2)' } } }}
      PaperProps={{
        style: {
          borderRadius: '8px',
          padding: '20px',
          display: 'flex',
          gap: '20px',
          width: width,
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        },
      }}
      {...other}
    >
      {children}
    </Dialog>
  );
});

const InputField = styled(TextField)({
  width: "100%",
  '& .MuiInputBase-root': {
    borderRadius: '6px',
    height: '36px'
  },
  '& .MuiInputBase-input': {
    color: THEME_COLORS.get('black'),
    padding: '8px 12px 8px 8px',
  },
  '& .MuiInputBase-multiline': {
    color: THEME_COLORS.get('black'),
    padding: '8px 12px 8px 8px',
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 'auto',
    color: THEME_COLORS.get('red')
  }, 
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      border: `1px solid ${THEME_COLORS.get('blue')}`,
    },
  },
});

const DialogButton = styled(Button)({
  margin: 0,
  padding: '8px 12px',
  textTransform:'none',
  boxShadow: 'none',
  height: '36px'
});

export { DialogTitle, DialogContent, DialogActions, DialogWindow, InputField, DialogButton };
