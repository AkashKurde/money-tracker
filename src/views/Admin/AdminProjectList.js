import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADMIN_DATA, APPROVER_DATA } from '../../redux/actionTypes';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { baseURL } from '../../utils/services';
import axios from 'axios';

const dateStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '60px',
  borderRight: '2px solid black',
  paddingRight: '20px',
};
const cardAlign={
  maxWidth: "200px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis"
}

const AdminProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginData = useSelector(state => state.auth.user);
  const projectId = useSelector(state => state.AdminProjectIDReducer.id);
  const adminStatus= useSelector(state=>state.AdminStatusReducer.status)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const [data,setData]=useState([]);

  useEffect(() => {
    // Set initial start and end dates to the current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedFirstDay = `${firstDayOfMonth.getFullYear()}-${(firstDayOfMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${firstDayOfMonth.getDate().toString().padStart(2, '0')}`;

    const formattedLastDay = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

    setStartDate(formattedFirstDay);
    setEndDate(formattedLastDay);
  }, []);

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setError('End Date should be greater than Start Date');
    } else {
      setError('');
    }
  }, [startDate, endDate]);

  const handleClickTitle = (val) => {
    dispatch({ type: ADMIN_DATA, payload: val });
    navigate('/admin-project-view');
  };

  const handleSearch = () => {
    if (adminStatus) {
      if (projectId) {
        axios({
          method: 'get',
          url: `${baseURL}/api/report/all-reports/by-project-status-date/${projectId}/${adminStatus}/${startDate}/${endDate}`,
          headers: {
            'Authorization': `Bearer ${loginData.jwt}`,
          },
        }).then((res)=>{
          console.log("res ad",res);
          setData(res.data)
        }).catch((err)=>{
          console.log("err admin",err)
        })
      } else {
        axios({
          method: 'get',
          url: `${baseURL}/api/report/all-reports/${adminStatus}/${startDate}/${endDate}`,
          headers: {
            'Authorization': `Bearer ${loginData.jwt}`,
          },
        }).then((res) => {
          console.log("res ad", res);
          setData(res.data)
        }).catch((err) => {
          console.log("err admin", err)
        })
      }

    }
  }

  useEffect(()=>{
    handleSearch()
  },[startDate,endDate])
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
            <Header name={'Report List'}/>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '95%',
                    gap:'10px',
                    marginTop: '20px',
                }}
            >

                <TextField
                    label="Start Date"
                    variant="outlined"
                    fullWidth
                    type="date"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ marginBottom: '10px' }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <TextField
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ marginBottom: '10px' }}
                    variant="outlined"
                    fullWidth
                    type="date"
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}

                />
            </Box>
            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginBottom: '10px', textTransform: 'none',width:'95%' }}
                disabled={!startDate || !endDate || error}
                onClick={handleSearch}
                >
                Search
            </Button>
            {data.length === 0 ? (
                <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
                    No data available
                </Typography>
            ) : (
                <Grid container spacing={2} sx={{ marginTop: '20px',paddingLeft:'10px',paddingRight:'10px'}}>
                        {data && data.map((val) => {
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
                                    <Card
                                        onClick={()=>handleClickTitle(val)}
                                        sx={{ display: 'flex', alignItems: 'center', gap:'20px'}}
                                    >
                                        <CardContent sx={dateStyle}>
                                            <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>{day}</Typography>
                                            <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>{month}</Typography>
                                        </CardContent>
                                        <div style={{display:'flex',flexDirection:'column'}}>
                                            <div>
                                                <Typography variant="h6" style={cardAlign}>{val.title}</Typography>
                                            </div>
                                            <div>
                                                <Typography sx={{ fontSize: '15px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'175px'}}>{`Approved By ${val.approverName}`}</Typography>
                                            </div>
                                        </div>
                                    </Card>
                                </Grid>
                            )
                        })}
                </Grid>
            )}
        </Container>
    );
};

export default AdminProjectList;
