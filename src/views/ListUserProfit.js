import { Alert, Backdrop, Card, CardContent, Chip, CircularProgress, Container, Grid, IconButton, Paper, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '../utils/services';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { USER_PROFIT_DATA } from '../redux/actionTypes';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
const dateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60px', // Fixed width for the month and date part
    borderRight: '2px solid black', // Add border to the right side
    paddingRight: '20px', // Add some padding to separate text from border
  };
  
  const cardAlign={
    maxWidth: "200px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }
  const amountAlogn={
    maxWidth: "190px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontSize: 'large'
  }
const ListUserProfit = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const loginData = useSelector((state) => state.auth.user);
    const [profitReport, setProfitReport] = useState([]);
    const [loading, setloading] = useState(false);
    const [deleteFlag,setDeleteFlag]=useState(false);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    useEffect(()=>{
        dispatch({type: USER_PROFIT_DATA ,payload: null})
    },[])
    useEffect(() => {
        setloading(true)
        axios({
            method: 'get',
            url: `${baseURL}/api/profit/by-self`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log('Response: report get', res.data);
                setloading(false)
                setProfitReport(res.data);
            })
            .catch((err) => {
                console.log('Error:', err);
                setloading(false)
                setProfitReport([])
            });
    }, [deleteFlag]);
    const handleDelete=(id)=>{
        setloading(true)
        axios({
            method: 'delete',
            url: `${baseURL}/api/profit/${id}`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log('Response: report get', res.data);
                setloading(false);
                setDeleteFlag(!deleteFlag);
                setOpen(true);
                setSeverity('success')
                setMsg(res.data)
            })
            .catch((err) => {
                console.log('Error:', err);
                setloading(false);
                setOpen(true);
                setSeverity('error')
                setMsg('Error while delete')
            });
    }
    const handelClickCard=(val)=>{
        dispatch({type: USER_PROFIT_DATA ,payload: val})
        navigate('/create-profit')
      }
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
            <Header name={'Refund List'} />
            {profitReport && profitReport.length <= 0 && <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
                No data available
            </Typography>}
                <Grid container spacing={2} sx={{ marginTop: '25px', paddingLeft: '10px', paddingRight: '10px' }}>
                    {profitReport &&
                        profitReport.map((val) => {
                            // Parse the date string from 'val' to create a Date object
                            const date = new Date(val.createdAt); // Replace 'date' with the actual date property in 'val'

                            // Define options for formatting the date
                            const options = { day: 'numeric', month: 'short' };

                            // Format the date using Intl.DateTimeFormat
                            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

                            // Split the formatted date into day and month
                            const [day, month] = formattedDate.split(' ');

                            return (
                                <Grid key={val.id} item xs={12} sm={6} md={4}>
                                    <Card sx={{ display: 'flex', alignItems: 'center' }} onClick={()=>handelClickCard(val)}>
                                        <CardContent sx={dateStyle}>
                                            <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>{day}</Typography>
                                            <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>{month}</Typography>
                                        </CardContent>
                                        <CardContent sx={{paddingBottom:'0px !important',display:'flex',flexDirection:'column',gap:'2px',marginBottom:'10px'}}>
                                            <Typography variant="h6" style={cardAlign}>{val.note}</Typography>
                                            <Typography variant="h6" style={amountAlogn}>Amount:  {val.amount}</Typography>
                                            <Chip label={val.status === 'DRAFT' ? 'Draft' : 'Approved'} color="primary" sx={{width:'80px',height:'24px'}}/>
                                        </CardContent>
                                        {val.status === 'DRAFT' && 
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                sx={{position:'absolute',right:'22px'}}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(val.id)}}
                                            >
                                                <DeleteIcon sx={{width:'30px',height:'30px',color:'red'}}/>
                                            </IconButton> }
                                    </Card>
                                </Grid>
                            );
                        })
                    }
                </Grid>
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>
            <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default ListUserProfit