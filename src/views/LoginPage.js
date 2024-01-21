import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Modal,
  Box,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/actions/authActions';
import axios from 'axios';
import { baseURL } from '../utils/services';
import LogoNoteBook from '../assests/LogoNoteBook.png'
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userHelperTxt, setUserHelperTxt] = useState('')
  const [passhelperText, setPasshelperText] = useState('');
  const loginData = useSelector(state => state.auth.user);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('error');
  const [loading,setloading]=useState(false)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = () => {
    setOpenModal(false);
    axios.post(`${baseURL}/api/authentication/reset/${email}`)
    .then((res)=>{
      console.log("res forgot",res)
      setOpen(true);
      setSeverity('success')
      setMsg(res.data);
      setTimeout(()=>{
        navigate('/reset')
      },1000)
    }).catch((err)=>{
      console.log("err forgot",err);
      setOpen(true);
      setSeverity('error')
      setMsg(err.message)
    })
   
  };

  useEffect(() => {
    if (loginData !== null) {

      if (loginData.roles[0].authority === 'APPROVER') {
        navigate('/approver', { replace: true });
      } else if (loginData.roles[0].authority === 'ADMIN') {
        navigate('/admin-dashboard', { replace: true });
      } else if (loginData.roles[0].authority === 'GENERAL') {
        navigate('/projectlist', { replace: true });
      }

    }
  }, [loginData]);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleChangePassword=(e)=>{
    setPassword(e.target.value);
  }
  const handleChangeUser=(e)=>{
    setUsername(e.target.value);
  }
  const handleLogin = () => {
    setloading(true);
    if (username.length <= 0) {
      setUserHelperTxt('Enter Username');
    } else if (password.length <= 0) {
      setPasshelperText('Enter Password');
    } else {
      dispatch(login(username, password)).then((res) => {
        setloading(false)
        // navigate('/project', { replace: true }); // Navigate to the home page after successful login
      }).catch((error) => {
        // Login failed
        // Display an error message to the user or perform any necessary action
        setloading(false)
        setOpen(true);
        setSeverity('error')
        setMsg(`${error.response?.data.message}`)
        setUsername('');
        setPassword('')
        console.log(error.message);
      });
    }
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
      <Paper
        elevation={0}
        style={{
          padding: '16px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
          margin: '20px',
        }}
      >
        <div>
          <img src={LogoNoteBook} alt='logo' width='260px' height='140px' />
        </div>
       
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            size="medium"
            value={username}
            helperText={userHelperTxt}
            onChange={(e)=>handleChangeUser(e)}
            sx={{marginTop:'30px'}}
          />
          <TextField
            label="Password"
            variant="outlined"
            size="medium"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e)=>handleChangePassword(e)}
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
          <Typography
            variant="body2"
            style={{ display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', color: 'blue' }}
            onClick={handleOpenModal}
          >
            Forgot Password?
          </Typography>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px', textTransform: 'none' }}
            onClick={handleLogin}
            disabled={!(username && password)}
          >
            Login
          </Button>
        
      </Paper>

      {/* Password Reset Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="password-reset-modal"
        aria-describedby="password-reset-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'white',
            boxShadow: 24,
            p: 2,
            outline: 'none',
            borderRadius: '4px',
          }}
        >
          <Typography variant="h6">Reset Password</Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleEmailChange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSendEmail}
            style={{ marginTop: '16px', textTransform: 'none' }}
          >
            Send
          </Button>
        </Box>
      </Modal>

      <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
      <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
        <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
      </Backdrop>
    </Container>
  );
};

export default LoginPage;
