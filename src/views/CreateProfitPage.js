import { Alert, Autocomplete, Backdrop, Box, CircularProgress, Container, MenuItem, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from './Header'
import { Button, FormControl, InputLabel, Paper, Select, TextField } from '@mui/material'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { baseURL } from '../utils/services'
import { useNavigate } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';

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
    const [files, setFiles] = useState();
    const [editMode,setEditmode]=useState(false);
    const [updatedFiles,setUpdatedfiles]=useState([]);
    const [deleteFlag,setDeleteflag]=useState(false);
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
                url: `${baseURL}/api/profit/create-refund`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: {
                    ...profitDetails,
                    status:"APPROVED"
                },
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
        } else {
            // Create a FormData object
            const formData = new FormData();
            // Append each file to the FormData object
            if (files) {
                files.forEach((file, index) => {
                    formData.append(`files`, file);
                });
            }

            // Append other data to the FormData object
            formData.append('status', 'APPROVED');
            Object.entries(profitDetails).forEach(([key, value]) => {
                formData.append(key, value);
            });

            axios({
                method: 'post',
                url: `${baseURL}/api/profit/create-refund`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: formData,
            })
                .then((res) => {
                    console.log('Response:', res.data);
                    setloading(false);
                    setOpen(true);
                    setSeverity('success');
                    setMsg('Profit Submitted Successfully');
                    setTimeout(() => {
                        navigate('/user-profit-list');
                    }, 1000);
                })
                .catch((err) => {
                    console.log('Error:', err);
                    setloading(false);
                    setOpen(true);
                    setSeverity('error');
                    setMsg('Error Submitting Profit');
                });
        }
        
    }
    const handleSaveAsDraft = () => {
        setloading(true)
        if(ProfitData != null){
            
            axios({
                method: 'put',
                url: `${baseURL}/api/profit/create-refund`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: {
                    ...profitDetails,
                    status:"DRAFT"
                },
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
             // Create a FormData object
             const formData = new FormData();
             // Append each file to the FormData object
             if (files) {
                 files.forEach((file, index) => {
                     formData.append(`files`, file);
                 });
             }
 
             // Append other data to the FormData object
             formData.append('status', 'DRAFT');
             Object.entries(profitDetails).forEach(([key, value]) => {
                 formData.append(key, value);
             });
 
            axios({
                method: 'post',
                url: `${baseURL}/api/profit/create-refund`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
                data: formData,
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
            setEditmode(true)
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
                  setUpdatedfiles(res.data.reportFiles)
                })
                .catch((err) => {
                  console.log('Error:', err);
                });
        }else{
            setEditmode(false)
        }
    },[ProfitData,deleteFlag]);

    const handleFileChange = (e) => {
        const filesVar = e.target.files;
        setFiles(Array.from(filesVar));

        if (editMode) {
          setloading(true)
          const formData = new FormData();
          for (let i = 0; i < filesVar.length; i++) {
            formData.append('files', filesVar[i]);
          }
          formData.append('reportId', ProfitData.id);
          // Now you can send the formData to the server
          axios
            .post(`${baseURL}/api/profit/update-file`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data', // Important for sending files
                Authorization: `Bearer ${loginData.jwt}`,
              },
            })
            .then((res) => {
              console.log("res report", res);
              setloading(false)
            })
            .catch((err) => {
              console.log("err", err)
              setloading(false)
            });
        }
      };

    const handleDeleteFile = (id) => {
        axios({
            method: 'delete',
            url: `${baseURL}/api/profit/delete-file/${id}`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
        }).then((res) => {
            console.log("res delete", res);
            setDeleteflag(!deleteFlag)
        }).catch((err) => {
            console.log("err", err)
        })
    }

    const downloadZip = (filepath) => {
        const url = filepath;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

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
            <Header name={'Refund'} />
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginTop: '10px' }}>
                    <label htmlFor="file-upload">
                        <Button disabled={profitDetails.status === "APPROVED"} variant="contained" fullWidth color="primary" component="span" sx={{ textTransform: 'none' }}>
                            Browse File
                        </Button>
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleFileChange}

                    />
                    {updatedFiles && updatedFiles.length > 0 && editMode && (
                        <ul>
                            {updatedFiles.map((file, index) => {
                                const parts = file.location.split('\\');
                                const filename = parts[parts.length - 1];

                                return (
                                    <li key={index} style={{ display: 'flex', gap: '10px', marginTop: '5px'}} onClick={()=>downloadZip(file.location)}>
                                        {filename}{' '}
                                        {profitDetails.status === "DRAFT" && 
                                        <DeleteIcon sx={{ width: '19px', height: '19px'}}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteFile(file.id)}}
                                        />}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {files && files.length > 0 && (
                        <Typography variant="subtitle1">
                            {`${files.length} files selected`}
                        </Typography>
                    )}
                </Box>
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