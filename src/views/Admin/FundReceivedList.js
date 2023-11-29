import { Container } from '@mui/system';
import React, { useEffect, useState } from 'react'
import Header from '../Header';
import { Backdrop, Card, CardContent, Chip, CircularProgress, Grid, Pagination, Typography } from '@mui/material';
import axios from 'axios';
import { baseURL } from '../../utils/services';
import { useDispatch, useSelector } from 'react-redux';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useNavigate } from 'react-router-dom';
import { USER_PROFIT_DATA } from '../../redux/actionTypes';

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
const FundReceivedList = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [profitReport, setProfitReport] = useState([]);
    const loginData = useSelector((state) => state.auth.user);
    const [loading, setloading] = useState(false);
    const [pageCount,setPageCount]=useState(0);
    const [currentPage,setCurrentPage]=useState(0);
    const projectId = useSelector(state => state.AdminProjectIDReducer.id);

    useEffect(()=>{
        dispatch({type: USER_PROFIT_DATA ,payload: null})
    },[])
    useEffect(() => {
        setloading(true)
        if (projectId) {
            axios({
                method: 'get',
                url: `${baseURL}/api/profit/by-project/${projectId}`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            })
                .then((res) => {
                    console.log('Response: report get', res.data);
                    setloading(false)
                    setProfitReport(res.data);
                    // setPageCount(res.data.totalPages)
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false)
                    setProfitReport([])
                });
        } else {
            axios({
                method: 'get',
                url: `${baseURL}/api/profit/by-all-project/${currentPage}`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            })
                .then((res) => {
                    console.log('Response: report get', res.data);
                    setloading(false)
                    setProfitReport(res.data.content);
                    setPageCount(res.data.totalPages)
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false)
                    setProfitReport([])
                });
        }

    }, []);

    const handlePageChange = (event, page) => {
        setCurrentPage(page - 1);
      }
    

    const handelClickCard=(val)=>{
        dispatch({type: USER_PROFIT_DATA ,payload: val})
        navigate('/fund-List')
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
                                        <Chip label={val.status === 'DRAFT' ? 'Draft' : 'Approved'} color="primary" sx={{ width: '80px', height: '24px' }} />
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }

            </Grid>
            {projectId == null &&
                <Pagination
                    color="primary"
                    count={pageCount}
                    page={currentPage + 1}
                    sx={{ mt: 2 }}
                    onChange={handlePageChange}
                />}
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>
        </Container>
    )
}

export default FundReceivedList