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
  TextField,
  Paper,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../utils/services';
import { useNavigate } from 'react-router-dom';
import { REPORT_DATA, SET_DATE, SET_SUBPROJ_ID, USER_PROFIT_DATA } from '../redux/actionTypes';
import Header from './Header';
import { Box } from '@mui/system';


const ProjectList = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const loginData = useSelector((state) => state.auth.user);
  const [loading,setloading]=useState(false);
  const [allReport,setAllReport] = useState({result: null, remainingFund: null})
  const storedDate=useSelector(state=>state.DateReduce);
  const subProj=useSelector(state=>state.SubProjIdReducer.subProj);
  const [error, setError] = useState('');
  const [SubprojectOptions, setSubprojectOptions] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('success');

  useEffect(() => {
    // Set initial start and end dates to the current month
    if (storedDate.startDate === null && storedDate.endDate === null) {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const formattedFirstDay = `${firstDayOfMonth.getFullYear()}-${(firstDayOfMonth.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${firstDayOfMonth.getDate().toString().padStart(2, '0')}`;

      const formattedLastDay = `${lastDayOfMonth.getFullYear()}-${(lastDayOfMonth.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

      dispatch({
        type: SET_DATE, payload: {
          startDate: formattedFirstDay,
          endDate: formattedLastDay
        }
      })
    }
  }, []);

  useEffect(() => {
    if (storedDate.startDate && storedDate.endDate) {
      if (error === '' && subProj !== '') {
        setloading(true)
        axios({
          method: 'get',
          url: `${baseURL}/api/report/credit-debit-report/by-subproject/${subProj}/${storedDate.startDate}/${storedDate.endDate}`,
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
            setAllReport({ result: null, remainingFund: null })
          });
      }else{
        setAllReport({ result: null, remainingFund: null })
      }
    }
  }, [storedDate.startDate,storedDate.endDate,subProj]);

  useEffect(()=>{
    dispatch({type: REPORT_DATA,payload: null})
    dispatch({type: USER_PROFIT_DATA ,payload: null})
  },[])

  useEffect(() => {
    if (storedDate.startDate && storedDate.endDate && storedDate.startDate > storedDate.endDate) {
      setError('End Date should be greater than Start Date');
    } else {
      setError('');
    }
  }, [storedDate.startDate, storedDate.endDate]);

  useEffect(() => {
    
      axios({
        method: 'get',
        url: `${baseURL}/api/project-query/sub-project-by-user`,
        headers: {
          Authorization: `Bearer ${loginData.jwt}`,
        },
      })
        .then((res) => {
          console.log('Response:', res.data);
          setSubprojectOptions(res.data)
          if (subProj === '') {
          dispatch({ type: SET_SUBPROJ_ID, payload: res.data[0].id })
          }
        })
        .catch((err) => {
          console.log('Error:', err);
          setOpenToast(true);
          setSeverity('error');
          setMsg("Error Fetching Sub-Project")
          setSubprojectOptions([]);
          dispatch({ type: SET_SUBPROJ_ID, payload: '' })
        });
    
  }, []);

  const handelClickCard=(val)=>{
    if(val.refund){
      dispatch({type: USER_PROFIT_DATA ,payload: val})
      navigate('/create-profit')
    }else{
      dispatch({type: REPORT_DATA,payload: val})
      navigate('/expense')
    }
  }
  const goToExpenseReport=()=>{
    dispatch({type: REPORT_DATA,payload: null})
    navigate('/expense')
  }
  
  const handleSubProjectChange = (event) => {
    const selectedSubProject = event.target.value;
    dispatch({type:SET_SUBPROJ_ID,payload:selectedSubProject})
  };

  const handleClosetoast = (event, reason) => {
    if (reason === 'clickaway') {
        return;
    }
    setOpenToast(false);
};
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
      <Box sx={{ display: 'flex', width: '95%',marginTop: '20px',gap:'20px'  }}>
        <Button variant="contained" color="primary" fullWidth style={{ textTransform: 'none' }} onClick={goToExpenseReport}>Create Expense</Button>
        <Button variant="contained" color="primary" fullWidth style={{ textTransform: 'none' }} onClick={()=>{
          dispatch({type: USER_PROFIT_DATA ,payload: null})
          navigate("/create-profit");
        }}>Add Fund</Button>
      </Box>
      <Box sx={{width:'95%'}}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Sub Project</InputLabel>
          <Select
            label="Sub Project"
            size="medium"
            value={subProj}
            onChange={handleSubProjectChange}
            sx={{ textAlign: 'left'}}
            >
            {SubprojectOptions && SubprojectOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '95%',
          gap: '10px',
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
        value={storedDate.startDate}
          onChange={(e) => dispatch({ type: SET_DATE, payload: { startDate: e.target.value, endDate: storedDate.endDate } })}
        />
        <TextField
          label="End Date"
          value={storedDate.endDate}
          onChange={(e) => dispatch({type:SET_DATE,payload:{startDate:storedDate.startDate,endDate:e.target.value}})}
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
      <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px', marginTop: '10px', width: '92%' }}>
        <Typography sx={{ fontSize: '16px', color: '#646464', fontWeight: '600' }}>Remaining Amount</Typography>
        <Typography sx={{ fontSize: '20px', fontWeight: '600', color: allReport.remainingFund !== null ? (allReport.remainingFund > 0 ? 'green' : 'red') : 'green' }}>{allReport.remainingFund !== null ? allReport.remainingFund : 0}</Typography>
      </Box>
      {allReport?.result !== null && allReport.result.length === 0 ? (
        <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
          No data available
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {allReport.result &&
              allReport.result.map((val,ind) => {
                return (
                  <Grid key={ind} item xs={12} sm={6} md={4}>
                    <Card sx={{ display: 'flex', alignItems: 'center',justifyContent:"space-between"}} onClick={() => handelClickCard(val)}>
                      <CardContent sx={{paddingLeft:'10px',paddingRight:'10px',paddingTop:'10px',paddingBottom:'10px'}}>
                      {val.refund ? <Typography sx={{ color: 'black', maxWidth: "175px", fontSize: '17px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val.title ? val.title : '-'}</Typography> :
                          <Typography  sx={{ color: 'black',maxWidth: "175px", fontSize: '17px', fontWeight: 500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{val.description ? val.description : '-'}</Typography>}                        <Typography  sx={{ color:'#6b5c5c',maxWidth: "175px", fontSize: '15px', fontWeight: 500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>By {val.username ? val.username : '-'}</Typography>
                        <Typography  sx={{ color:'#6b5c5c',fontWeight: '500',maxWidth: "175px",whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Date : {val.createdAt ? val.createdAt.split('T')[0] : '-'}</Typography>
                        {val.approvalStatus === 'DRAFT' && <Chip label={'Draft'} color="primary" sx={{ width: '80px', height: '24px',marginTop:'10px' }} /> }
                        {val.approvalStatus === 'APPROVED' && <Chip label={'Approved'} sx={{ width: '80px', height: '24px',marginTop:'10px',background:'green',color:'white' }} /> }
                        {val.approvalStatus === 'IN_APPROVAL' && <Chip label={'In-Approval'} sx={{ width: '93px', height: '24px',marginTop:'10px',background:'#f3f344',color:'black' }} /> }
                        {val.approvalStatus === 'REJECTED' && <Chip label={'Rejected'} sx={{ width: '80px', height: '24px',marginTop:'10px',background:'red',color:'white' }} /> }
                      </CardContent>
                      <CardContent sx={{paddingLeft:'10px',paddingRight:'0px',paddingTop:'10px',paddingBottom:'10px !important',marginRight:'15px'}}>
                        <Typography style={{ maxWidth: "82px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", color: val.refund ?  'green' : 'red', fontWeight: '700',fontSize:'17.6px' }}>{`${val.refund ? '+' : '-'}${val.amount}`}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            }
          </Grid>
        </>)}
        <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
        <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
      </Backdrop>
      <Snackbar sx={{ top: '75px' }} open={openToast} autoHideDuration={4000} onClose={handleClosetoast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert variant='filled' onClose={handleClosetoast} severity={severity} sx={{ width: '100%' }}>
          {msg}
        </Alert>
      </Snackbar>
    </Container>
  )
};

export default ProjectList;
