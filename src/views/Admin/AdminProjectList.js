import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
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
import { ADMIN_DATA, ADMIN_PRJ_ID, APPROVER_DATA, SET_ALL_CHECK, SET_DATE, SET_SUBPROJ_ID, USER_PROFIT_DATA } from '../../redux/actionTypes';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { baseURL } from '../../utils/services';
import axios from 'axios';

const AdminProjectList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginData = useSelector(state => state.auth.user);
  const [error, setError] = useState('');
  const [data,setData]=useState({result: null, remainingFund: null});
  const [projectOptions, setprojectOptions] = useState([]);
  const [SubprojectOptions, setSubprojectOptions] = useState([]);
  const subProj=useSelector(state=>state.SubProjIdReducer.subProj);
  const storedDate=useSelector(state=>state.DateReduce);
  const projectId = useSelector(state => state.AdminProjectIDReducer.id);
  const allChecked=useSelector(state=>state.AllCheckReducer.allCheck);
  
  useEffect(() => {
    if (storedDate.startDate === null && storedDate.endDate === null) {
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

        dispatch({
          type: SET_DATE, payload: {
            startDate: formattedFirstDay,
            endDate: formattedLastDay
          }
        })
    }
  }, []);

  useEffect(() => {
    if (storedDate.startDate && storedDate.endDate && storedDate.startDate > storedDate.endDate) {
      setError('End Date should be greater than Start Date');
    } else {
      setError('');
    }
  }, [storedDate.startDate, storedDate.endDate]);

  const handleClickTitle = (val) => {
    if(val.refund){
      dispatch({type: USER_PROFIT_DATA ,payload: val})
      navigate('/fund-List')
    }else{
      dispatch({ type: ADMIN_DATA, payload: val });
      navigate('/admin-project-view');
    }
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: `${baseURL}/api/project-query/all`,
      headers: {
        'Authorization': `Bearer ${loginData.jwt}`,
      },
    })
      .then((res) => {
        console.log("Response:", res.data);
        setprojectOptions(res.data);
      })
      .catch((err) => {
        console.log("Error:", err);
      });
  }, []);

  const handleProjectChange = (event) => {
    const selectedProject = event.target.value;
    dispatch({type:ADMIN_PRJ_ID,payload:selectedProject})
  }

  useEffect(() => {
    if (projectId !== null) {
      axios({
        method: 'get',
        url: `${baseURL}/api/project-query/sub-project/all/${projectId}`,
        headers: {
          Authorization: `Bearer ${loginData.jwt}`,
        },
      })
        .then((res) => {
          console.log('Response:', res.data);
          setSubprojectOptions(res.data);
        })
        .catch((err) => {
          console.log('Error:', err);
          setSubprojectOptions([]);
        });
    }
  }, [projectId])
  const handleSubProjectChange = (event) => {
    const selectedSubProject = event.target.value;
    dispatch({type:SET_SUBPROJ_ID,payload:selectedSubProject})
  };

  useEffect(() => {
    if (storedDate.startDate && storedDate.endDate) {
      if (error === '' && (subProj !== '' || allChecked)) {
        axios({
          method: 'get',
          url: allChecked ? `${baseURL}/api/report/credit-debit-report/by-project-status-date/${projectId}/APPROVED/${storedDate.startDate}/${storedDate.endDate}` : `${baseURL}/api/report/credit-debit-report/by-subproject/${subProj}/${storedDate.startDate}/${storedDate.endDate}`,
          headers: {
            'Authorization': `Bearer ${loginData.jwt}`,
          },
        }).then((res) => {
          console.log("res ad", res);
          setData(res.data)
          if (res.data.startDate === null || res.data.endDate === null) {
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
          }else{
            dispatch({
              type: SET_DATE, payload: {
                startDate: res.data.startDate !== null && res.data.startDate.split('T')[0],
                endDate: res.data.endDate !== null && res.data.endDate.split('T')[0]
              }
            })
          }
          
        }).catch((err) => {
          console.log("err admin", err);
          setData({result: null, remainingFund: null})
        })
      }else{
        setData({result: null, remainingFund: null})
      }
    }else{
      setData({result: null, remainingFund: null})
    }
  }, [storedDate.startDate, storedDate.endDate ,allChecked,subProj,projectId])
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
      <Header name={'Report List'} />

      <Box width='95%'>
        <FormControl sx={{ marginBottom: '0px' }} fullWidth variant="outlined" margin="normal">
          <InputLabel>Project</InputLabel>
          <Select
            label="Project"
            size="medium"
            value={projectId}
            onChange={handleProjectChange}
            sx={{ textAlign: 'left' }}
          >
            {projectOptions && projectOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box width='95%' sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Sub-Project</InputLabel>
          <Select
            label="Sub-Project"
            size="medium"
            value={subProj}
            onChange={handleSubProjectChange}
            sx={{ textAlign: 'left' }}
            disabled={allChecked}
          >
            {SubprojectOptions && SubprojectOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={allChecked} onChange={(e) => {
            if (e.target.checked) {
              dispatch({type:SET_SUBPROJ_ID,payload:''})
            }
            dispatch({type:SET_ALL_CHECK,payload:e.target.checked})
          }} />} label="All" />
        </FormGroup>
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
        <Typography sx={{ fontSize: '20px', fontWeight: '600', color: data.remainingFund !== null ? (data.remainingFund > 0 ? 'green' : 'red') : 'green' }}>{data.remainingFund !== null ? data.remainingFund : 0}</Typography>
      </Box>
      {data?.result !== null && data.result.length === 0 ? (
        <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
          No data available
        </Typography>
      ) : (
        <>
          <Grid container spacing={2} sx={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {data.result &&
              data.result.map((val, ind) => {
                return (
                  <Grid key={ind} item xs={12} sm={6} md={4}>
                    <Card sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }} onClick={() => handleClickTitle(val)}>
                      <CardContent sx={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px', paddingBottom: '10px' }}>
                        {val.refund ? <Typography sx={{ color: 'black', maxWidth: "175px", fontSize: '17px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val.title ? val.title : '-'}</Typography> :
                          <Typography  sx={{ color: 'black',maxWidth: "175px", fontSize: '17px', fontWeight: 500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{val.category ? val.category : '-'}</Typography>}
                        <Typography  sx={{ color:'#6b5c5c',maxWidth: "175px", fontSize: '15px', fontWeight: 500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>By {val.username ? val.username : '-'}</Typography>
                        <Typography  sx={{ color:'#6b5c5c',fontWeight: '500',maxWidth: "175px",whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>Date : {val.createdAt ? val.createdAt.split('T')[0] : '-'}</Typography>
                        {val.approvalStatus === 'DRAFT' && <Chip label={'Draft'} color="primary" sx={{ width: '80px', height: '24px',marginTop:'10px' }} /> }
                        {val.approvalStatus === 'APPROVED' && <Chip label={'Approved'} sx={{ width: '80px', height: '24px',marginTop:'10px',background:'green',color:'white' }} /> }
                        {val.approvalStatus === 'IN_APPROVAL' && <Chip label={'In-Approval'} sx={{ width: '93px', height: '24px',marginTop:'10px',background:'#f3f344',color:'black' }} /> }
                        {val.approvalStatus === 'REJECTED' && <Chip label={'Rejected'} sx={{ width: '80px', height: '24px',marginTop:'10px',background:'red',color:'white' }} /> }
                      </CardContent>
                      <CardContent sx={{ paddingLeft: '10px', paddingRight: '0px', paddingTop: '10px', paddingBottom: '10px !important', marginRight: '15px' }}>
                        <Typography style={{ maxWidth: "82px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", color: val.refund ? 'green' : 'red', fontWeight: '700', fontSize: '17.6px' }}>{`${val.refund ? '+' : '-'}${val.amount}`}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            }
          </Grid>
        </>)}
    </Container>
  );
};

export default AdminProjectList;
