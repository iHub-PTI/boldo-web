import { makeStyles } from '@material-ui/core';
export default makeStyles(theme => ({
  root: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256,
    },
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
  },
  tabHeight: {
    '& .MuiTab-root': {
      minHeight: '0px',
      minWidth: '120px',
      textTransform: 'none',
      padding: '2px',
      marginTop: '5px',
    },
  },
  tabHeightSmall: {
    '& .MuiTab-root': {
      minHeight: '0px',
      minWidth: '98px',
      textTransform: 'none',
      padding: '2px',
      marginTop: '5px',
    },
  },

  selected: {
    background: '#27BEC2',
    color: 'white',
  },
  textFieldPadding: {
    marginTop: '5px',
    '& .MuiOutlinedInput-input': {
      padding: '6.5px 14px',
    },
  },
  textFieldPaddingSmall: {
    marginTop: '5px',
    '& .MuiOutlinedInput-input': {
      padding: '9.5px 14px',
      fontSize: '12px',
    },
  },
  muiButtonOutlined: {
    borderColor: '#27BEC2',
    color: '#27BEC2',
    borderRadius: '10px',
  },
  muiButtonContained: {
    backgroundColor: '#27BEC2',
    borderColor: '#27BEC2',
    color: 'white',
    borderRadius: '10px',
  },
  input: {
    '&::placeholder': {
      fontWeight: 'bold',
    },
    marginRight:'35px'
  },
}))
