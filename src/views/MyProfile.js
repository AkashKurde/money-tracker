import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Snackbar, Alert, FormControlLabel, Radio, FormControl, RadioGroup, FormLabel } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../utils/services';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './Header';

const MyProfile = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('success');
  const [userDetails, setUserDetails] = useState({
    id:"",
    name: "",
    email: "",
    phone: "",
    username: "",
    role: ["GENERAL"], // Default to "General"
  });
  const loginData = useSelector(state => state.auth.user);
  const [formValid, setFormValid] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const validateEmail = (email) => {
    // Use a regular expression to validate the email format.
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  };

  useEffect(() => {
    // Check if all fields are filled, email is valid, and phone number is exactly 10 characters.
    const isFormValid =
      userDetails.name !== "" &&
      userDetails.email !== "" &&
      userDetails.phone.length === 10 && // Ensure exactly 10 characters
      userDetails.username !== "" &&
      validateEmail(userDetails.email);

    setFormValid(isFormValid);
  }, [userDetails]);

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setUserDetails({
      ...userDetails,
      role: [selectedRole],
    });
  };

  const handleRegister = () => {
    axios({
        method: 'put',
        url: `${baseURL}/api/authentication`,
        headers: {
            Authorization: `Bearer ${loginData.jwt}`,
        },
        data:userDetails
    }).then((res) => {
        console.log("res reg", res);
        setOpen(true);
        setMsg('Profile Updated Successful.');
        setSeverity('success');
      })
      .catch((err) => {
        setOpen(true);
        setMsg('Update Failed.');
        setSeverity('error');
        console.log("err reg", err);
      });
  };

  useEffect(()=>{
    axios({
        method: 'get',
        url: `${baseURL}/api/authentication/self-info`,
        headers: {
            Authorization: `Bearer ${loginData.jwt}`,
        },
    })
    .then((res) => {
      console.log("res self info", res);
      setUserDetails({
        id:res.data.id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        username: res.data.username,
        role: [res.data.authorities[0].authority],
      })
    })
    .catch((err) => {
      console.log("err self info", err);
    });
  },[])
  const handleUpdatePassword = () => {
    axios.post(`${baseURL}/api/authentication/reset/${userDetails.email}`)
    .then((res)=>{
      console.log("res forgot",res)
      setOpen(true);
      setSeverity('success')
      setMsg(res.data)
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
  return (
      <Container
          sx={{
              display: 'flex',
              flexDirection: 'column',  // To make sure the children stack vertically
              justifyContent: 'flex-start', // Start from the top
              alignItems: 'center', // Center horizontally
              minHeight: '100vh',
              p: 0, // Remove padding from the Container
          }}
      >
        <Header name={'Update Profile'}/>
      <Paper elevation={0} sx={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
        {/* <Typography sx={{ fontSize: '25px', fontWeight: '500' }}>
          Update Profile
        </Typography> */}
        <form>
          <TextField
            label="Full Name"
            name='name'
            variant="outlined"
            fullWidth
            size='medium'
            onChange={handleChange}
            value={userDetails.name}
            margin="normal"
          />
          <TextField
            label="Email"
            name='email'
            variant="outlined"
            fullWidth
            onChange={handleChange}
            size='medium'
            value={userDetails.email}
            margin="normal"
            error={!validateEmail(userDetails.email)}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name='phone'
            fullWidth
            onChange={handleChange}
            size='medium'
            value={userDetails.phone}
            margin="normal"
            error={userDetails.phone.length !== 10} // Check for 10 digits
          />
          <TextField
            label="Username"
            variant="outlined"
            name='username'
            fullWidth
            onChange={handleChange}
            value={userDetails.username}
            size='medium'
            margin="normal"
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Role</FormLabel>
            <RadioGroup
              row
              name="role"
              value={userDetails.role[0]}
              onChange={handleRoleChange}
            >
              <FormControlLabel value="GENERAL" control={<Radio />} label="General" />
              <FormControlLabel value="APPROVER" control={<Radio />} label="Approver" />
            </RadioGroup>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px', textTransform: 'none' }}
            onClick={handleRegister}
            disabled={!formValid}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px', textTransform: 'none' }}
            onClick={handleUpdatePassword}
          >
            Update Password
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

export default MyProfile;
