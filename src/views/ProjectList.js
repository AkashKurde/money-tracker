import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../utils/services';
import { useNavigate } from 'react-router-dom';
import { REPORT_DATA } from '../redux/actionTypes';
import Header from './Header';


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
  textOverflow: "ellipsis"
}
const ProjectList = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const loginData = useSelector((state) => state.auth.user);
  const [status,setStatus]=useState('');
  const [loading,setloading]=useState(false);
  const [selected, setSelected] = useState({
    draft: false,
    approval: true,
    reject: false
  })

  const [allReport,setAllReport] = useState([])
  const handleDraft = () => {
    setSelected({
      draft: true,
      approval: false,
      reject: false
    })
  }
  const handleApproval = () => {
    setSelected({
      draft: false,
      approval: true,
      reject: false
    })
  }
  const handleReject = () => {
    setSelected({
      draft: false,
      approval: false,
      reject: true
    })
  }

  useEffect(() => {
    setloading(true)
    axios({
      method: 'get',
      url: `${baseURL}/api/report/all-by-status/IN_APPROVAL`,
      headers: {
        Authorization: `Bearer ${loginData.jwt}`,
      },
    })
      .then((res) => {
        console.log('Response: report get', res.data);
        setloading(false)
        setAllReport(res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
        setloading(false)
        setAllReport([])
      });
  }, []);

  const handelClickCard=(val)=>{
    dispatch({type: REPORT_DATA,payload: val})
    navigate('/expense')
  }
  const goToExpenseReport=()=>{
    dispatch({type: REPORT_DATA,payload: null})
    navigate('/expense')
  }
  const handleStatus = (e) =>{
    setloading(true)
    setStatus(e.target.value);
    axios({
      method: 'get',
      url: `${baseURL}/api/report/all-by-status/${e.target.value}`,
      headers: {
        Authorization: `Bearer ${loginData.jwt}`,
      },
    })
      .then((res) => {
        console.log('Response: report get', res.data);
        setloading(false)
        setAllReport(res.data);
      })
      .catch((err) => {
        console.log('Error:', err);
        setloading(false)
        setAllReport([])
      });
  }
  return (
    <Container sx={{
      display: 'flex',
      flexDirection: 'column',  // To make sure the children stack vertically
      justifyContent: 'flex-start', // Start from the top
      alignItems: 'center', // Center horizontally
      minHeight: '100vh',
      p: 0, // Remove padding from the Container
    }}>
      <Header name={'Report List'} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', marginTop: '30px',gap:'15px' }}>
      <FormControl variant="outlined" sx={{ minWidth: '185px' }}>
        <InputLabel>Select</InputLabel>
        <Select label="Select" onChange={handleStatus} value={status}>
          <MenuItem value="IN_APPROVAL">IN-APPROVAL</MenuItem>
          <MenuItem value="DRAFT">DRAFT</MenuItem>
          <MenuItem value="APPROVED">APPROVED</MenuItem>
          <MenuItem value="REJECTED">REJECTED</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" sx={{ textTransform: 'none',height:'50px'}} onClick={goToExpenseReport}>
        Create Report
      </Button>
    </div>
      {allReport && allReport.length === 0 ? (
        <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
          No data available
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ marginTop: '25px',paddingLeft:'10px',paddingRight:'10px' }}>
            {allReport &&
              allReport.map((val) => {
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
                      <CardContent>
                        <Typography variant="h6" style={cardAlign}>{val.title}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            }

        </Grid>)}

        <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
        <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
      </Backdrop>
    </Container>
  )
};

export default ProjectList;
