import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, Snackbar, Typography } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../utils/services';
import { ADMIN_PRJ_ID, APPROVER_DATA, LOGOUT, REPORT_DATA, STATUS, USER_PROFIT_DATA } from '../redux/actionTypes';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('success');
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
const [resetDetails,setResetDetails] = useState({
  secretCode: '',
  username:"",
  newPassword:""
})
const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setOpen(false);
};
const handleChange = (e) => {
  const { name, value } = e.target;
  const updatedDetails = { ...resetDetails };

  if (name === 'secretCode') {
    // Parse the value as an integer
    updatedDetails[name] = parseInt(value, 10);
  } else {
    updatedDetails[name] = value;
  }

  setResetDetails(updatedDetails);
};

const handleReset = () =>{
  dispatch({ type: LOGOUT });
  dispatch({ type: USER_PROFIT_DATA, payload: null })
  dispatch({ type: REPORT_DATA, payload: null })
  dispatch({ type: ADMIN_PRJ_ID, payload: null })
  dispatch({ type: STATUS, payload: null })
  dispatch({ type: APPROVER_DATA, payload: null })
  axios.post(`${baseURL}/api/authentication/update-password`,resetDetails)
  .then((res)=>{
    console.log("res reset",res.data);
    setOpen(true);
    setSeverity('success')
    setMsg(res.data)
    setResetDetails({
      secretCode: '',
      username:"",
      newPassword:""
    })
    setTimeout(()=>{
      navigate('/', { replace: true })
    },1000)
  }).catch((err)=>{
    console.log("err reset",err.message);
    setOpen(true);
    setSeverity('error')
    setMsg(err.message)
  })
}
  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        margin: 0,
        padding: 0,
      }}
    >
      <Paper elevation={0} style={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center',margin:'20px'}}>
        <Typography sx={{fontSize:'25px',fontWeight:'500'}}>Reset Password</Typography>
        <form>
          <TextField
            label="username"
            name='username'
            variant="outlined"
            fullWidth
            margin="normal"
            size='medium'
            value={resetDetails.username}
            onChange={handleChange}
          />
          <TextField
            label="Secret Code"
            name='secretCode'
            variant="outlined"
            fullWidth
            type='number'
            margin="normal"
            size='medium'
            value={resetDetails.secretCode}
            onChange={handleChange}
          />
          <TextField
            label="New Password"
            name='newPassword'
            variant="outlined"
            size='medium'
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={resetDetails.newPassword}
            onChange={handleChange}
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px',textTransform:'none' }}
            onClick={handleReset}
          >
            Reset
          </Button>
        </form>
      </Paper>
      <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPassword;
