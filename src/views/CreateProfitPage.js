import { Alert, Autocomplete, Backdrop, Box, CircularProgress, Container, MenuItem, Snackbar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Button, FormControl, InputLabel, Paper, Select, TextField } from '@mui/material'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { baseURL } from '../utils/services'
import { useNavigate } from 'react-router-dom'

const CreateProfitPage = () => {
    const navigate=useNavigate();
    const loginData = useSelector((state) => state.auth.user);
    const ProfitData = useSelector((state) => state.UserReportDataReducer.data);
    const [SubprojectOptions, setSubprojectOptions] = useState([]);
    const [profitDetails, setProfitDetails] = useState({
        note: '',
        subProjectId: null,
        amount: null,
    })
    const [loading, setloading] = useState(false);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');
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

            })
            .catch((err) => {
                console.log('Error:', err);
                setSubprojectOptions([])
            });
    }, []);

    const handleSubProjectChange = (event) => {
        setProfitDetails((details) => ({
            ...details,
            subProjectId: event.target.value
        }))
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfitDetails({
            ...profitDetails,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        setloading(true)
        if(ProfitData != null){
            axios({
                method: 'put',
                url: `${baseURL}/api/profit`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: {
                    ...profitDetails,
                    status: 'APPROVED'
                }
            })
                .then((res) => {
                    console.log('Response:', res.data);
                    setloading(false)
                    setOpen(true);
                    setSeverity('success')
                    setMsg('Profit Submited Successfully');
                    setTimeout(() => {
                        navigate('/user-profit-list');
                      }, 1000);
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false)
                    setOpen(true);
                    setSeverity('error')
                    setMsg('Error Submiting Profit')
                })
        }else{
            axios({
                method: 'post',
                url: `${baseURL}/api/profit`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: {
                    ...profitDetails,
                    status: 'APPROVED'
                }
            })
                .then((res) => {
                    console.log('Response:', res.data);
                    setloading(false)
                    setOpen(true);
                    setSeverity('success')
                    setMsg('Profit Submited Successfully');
                    setTimeout(() => {
                        navigate('/user-profit-list');
                      }, 1000);
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false)
                    setOpen(true);
                    setSeverity('error')
                    setMsg('Error Submiting Profit')
                })
        }
        
    }
    const handleSaveAsDraft = () => {
        setloading(true)
        if(ProfitData != null){
            axios({
                method: 'put',
                url: `${baseURL}/api/profit`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: {
                    ...profitDetails,
                    status: 'DRAFT'
                }
            })
                .then((res) => {
                    console.log('Response:', res.data);
                    setloading(false)
                    setOpen(true);
                    setSeverity('success')
                    setMsg('Profit Drafted Successfully');
                    setTimeout(() => {
                        navigate('/user-profit-list');
                      }, 1000);
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false)
                    setOpen(true);
                    setSeverity('error')
                    setMsg('Error Drafting Profit')
                })
        }else{
            axios({
                method: 'post',
                url: `${baseURL}/api/profit`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: {
                    ...profitDetails,
                    status: 'DRAFT'
                }
            })
                .then((res) => {
                    console.log('Response:', res.data);
                    setloading(false)
                    setOpen(true);
                    setSeverity('success')
                    setMsg('Profit Drafted Successfully');
                    setTimeout(() => {
                        navigate('/user-profit-list');
                      }, 1000);
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false)
                    setOpen(true);
                    setSeverity('error')
                    setMsg('Error Drafting Profit')
                })
        }
       
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(()=>{
        if(ProfitData != null){
            setProfitDetails(ProfitData)
        }
    },[ProfitData])
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
            <Header name={'Profit'} />
            <Paper elevation={0} sx={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                <Autocomplete
                    value={SubprojectOptions.find(option => option.id === profitDetails.subProjectId) || null}
                    onChange={(event, newValue) => {
                        handleSubProjectChange({ target: { value: newValue ? newValue.id : null } });
                    }}
                    options={SubprojectOptions}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => <TextField {...params} label="Sub-Project" />}
                    disabled={ProfitData && ProfitData.status !== "DRAFT"}
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
                    disabled={ProfitData && ProfitData.status !== "DRAFT"}
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
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true, // This ensures the label stays floating
                    }}
                    disabled={ProfitData && ProfitData.status !== "DRAFT"}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ textTransform: 'none' }}
                        onClick={handleSaveAsDraft}
                        disabled={ProfitData && ProfitData.status !== "DRAFT"}

                    >
                        Save As Draft
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ textTransform: 'none' }}
                        onClick={handleSubmit}
                        disabled={ProfitData && ProfitData.status !== "DRAFT"}

                    >
                        Submit for approval
                    </Button>
                </Box>
            </Paper>
            <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>
        </Container>

    )
}

export default CreateProfitPage