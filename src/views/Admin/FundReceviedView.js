import { Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Backdrop, CircularProgress, FormControl, InputLabel, Button, Paper, Select, TextField, Snackbar, Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import { baseURL } from '../../utils/services'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const FundReceviedView = () => {
    const navigate=useNavigate();
    const ProfitData = useSelector((state) => state.UserReportDataReducer.data);
    const loginData = useSelector((state) => state.auth.user);
    const [SubprojectOptions, setSubprojectOptions] = useState([]);
    const [updatedFiles,setUpdatedfiles]=useState([]);
    const [subProjectName,setSubProjectName]=useState('')
    const [profitDetails, setProfitDetails] = useState({
        note: '',
        subProjectId: null,
        amount: null,
    })
   const [date,setDate]=useState(new Date().toISOString().split('T')[0]);
   const [open, setOpen] = useState(false);
   const [msg, setMsg] = useState('');
   const [severity, setSeverity] = useState('success');
    useEffect(() => {
        if (ProfitData !== null) {

            axios({
                method: 'get',
                url: `${baseURL}/api/profit/by-self/single/${ProfitData.id}`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            })
                .then((res) => {
                    console.log('Response: exp', res.data);
                    setProfitDetails(res.data);
                    setDate(res.data.createdAt !== null && res.data.createdAt.split('T')[0])
                    setUpdatedfiles(res.data.reportFiles)
                })
                .catch((err) => {
                    console.log('Error:', err);
                });



            axios({
                method: 'get',
                url: `${baseURL}/api/projects/sub-project/${ProfitData.subProjectId}`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            })
                .then((res) => {
                    console.log('Response: report get', res.data);
                    setSubProjectName(res.data.title);
                })
                .catch((err) => {
                    console.log('Error:', err);
                });
        }
    }, []);

    const downloadZip = (filepath) => {
        const url = filepath;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfitDetails({
            ...profitDetails,
            [name]: value,
        });
    };

    const handleSubmit=()=>{
        axios({
            method: 'put',
            url: `${baseURL}/api/profit/create-refund`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
            data: {
                ...profitDetails,
                createdAt: new Date(date).toISOString(),
                status:"APPROVED"
            },
        })
            .then((res) => {
                console.log('Response:', res.data);
                setOpen(true);
                setSeverity('success')
                setMsg('Profit Submited Successfully');
                setTimeout(() => {
                    navigate('/admin-projectlist');
                  }, 1000);
            })
            .catch((err) => {
                console.log('Error:', err);
                setOpen(true);
                setSeverity('error')
                setMsg('Error Submiting fund')
            })
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
  return (
    <Container
    sx={{
        display: 'flex',
        flexDirection: 'column',  
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        minHeight: '100vh',
        p: 0,
    }}
>
    <Header name={'Refund'} />
          <Paper elevation={0} sx={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
              <TextField
                  label="Sub-Project"
                  name="subProject"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  margin="normal"
                  value={subProjectName}
                  disabled
                  
              />
              <TextField
                  label="Note"
                  name="note"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  margin="normal"
                  value={profitDetails.note}
                  onChange={handleChange}
              />
              <TextField
                  label="Amount"
                  name="amount"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  type="number"
                  margin="normal"
                  value={profitDetails.amount}
                  InputLabelProps={{
                      shrink: true, // This ensures the label stays floating
                  }}
                  onChange={handleChange}
                  
              />
              <TextField
                  label="Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  margin="normal"
                  InputLabelProps={{
                      shrink: true,
                  }}
                  value={date}
                  onChange={handleDateChange}
              />
              {updatedFiles && updatedFiles.length > 0 && (
                  <ul>
                      {updatedFiles.map((file, index) => {
                          const parts = file.location.split('/');
                          const filename = parts[parts.length - 1];

                          return (
                              <li key={index} style={{ display: 'flex', gap: '10px', marginTop: '5px' }} onClick={() => downloadZip(file.location)}>
                                  {filename}{' '}
                              </li>
                          );
                      })}
                  </ul>
              )}

              <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={handleSubmit}
              >
                  Update
              </Button>
              <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                  <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                      {msg}
                  </Alert>
              </Snackbar>
          </Paper>
</Container>

  )
}

export default FundReceviedView