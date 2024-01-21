import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT, USER_PROFIT_DATA } from '../redux/actionTypes';
import ResponsiveModal from '../Components/ResponsiveModal';
import { useNavigate } from 'react-router-dom';

const Header = ({name}) => {
  const dispatch=useDispatch();
  const loginData = useSelector((state) => state.auth.user);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open,setOpen]=useState(false)
  const navigate=useNavigate();
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout=()=>{
    setAnchorEl(null);
    setOpen(true)
  }

  const handleApprovals = ()=>{
    setAnchorEl(null);
    navigate('/approver')
  }
  const goToReportList = ()=>{
    setAnchorEl(null);
    navigate('/projectlist')
  }
  const goToMyProfile = ( )=>{
    setAnchorEl(null);
    navigate("/my-profile");
  }
  const goToDashboard=()=>{
    setAnchorEl(null);
    navigate("/admin-dashboard");
  }
  const goToCreateProfit=()=>{
    setAnchorEl(null);
    dispatch({type: USER_PROFIT_DATA ,payload: null})
    navigate("/create-profit");
  }
  const goToListProfits=()=>{
    setAnchorEl(null);
    navigate("/user-profit-list");
  }
  const goToUsers=()=>{
    navigate('/users')
  }
  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {name}
        </Typography>

        <IconButton color="inherit" onClick={handleMenuClick}>
          <AccountCircleIcon sx={{width:'30px',height:'30px'}}/>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {/* <MenuItem onClick={goToMyProfile}>My Profile</MenuItem> */}
          {/* {loginData.roles[0].authority !== 'ADMIN' && <MenuItem onClick={goToCreateProfit}>Create Refund</MenuItem>} */}
          {/* {loginData.roles[0].authority !== 'ADMIN' && <MenuItem onClick={goToListProfits}>Refund List</MenuItem>} */}
          {loginData.roles[0].authority === 'APPROVER' && <MenuItem onClick={handleApprovals}>Approvals List</MenuItem> }
          {loginData.roles[0].authority === 'GENERAL' && <MenuItem onClick={goToReportList}>Report List</MenuItem> }
          {loginData.roles[0].authority === 'ADMIN' && <MenuItem onClick={goToDashboard}>Dashboard</MenuItem> }
          {loginData.roles[0].authority === 'ADMIN' && <MenuItem onClick={goToUsers}>Users</MenuItem> }
          <MenuItem onClick={handleLogout}>Log-out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
    <ResponsiveModal open={open} setOpen={setOpen} />
    </>
  );
};

export default Header;
