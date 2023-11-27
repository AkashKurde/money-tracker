import { Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import { useSelector } from 'react-redux'
import { baseURL } from '../../utils/services'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FundReceviedView = () => {
    const navigate=useNavigate();
    const ProfitData = useSelector((state) => state.UserReportDataReducer.data);
    const loginData = useSelector((state) => state.auth.user);
    const [SubprojectOptions, setSubprojectOptions] = useState([]);
    const [profitDetails, setProfitDetails] = useState({
        note: '',
        subProjectId: null,
        amount: null,
        subProjectName:''
    })
   
    useEffect(()=>{
        if(ProfitData !== null){
            //
            axios({
                method: 'get',
                url: `${baseURL}/api/projects/sub-project/${ProfitData.subProjectId}`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            })
                .then((res) => {
                    console.log('Response: report get', res.data);
                    setProfitDetails({
                        ...ProfitData,
                        subProjectName:res.data.title
                    })
                    
                })
                .catch((err) => {
                    console.log('Error:', err);
                });
            // setProfitDetails(ProfitData)
        }else{
            navigate(-1);
        }
    },[])
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
    <Header name={'User Profit'} />
          <Paper elevation={0} sx={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
              <TextField
                  label="Sub-Project"
                  name="subProject"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  margin="normal"
                  value={profitDetails.subProjectName}
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
                  disabled
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
                  disabled
              />
          </Paper>
</Container>

  )
}

export default FundReceviedView