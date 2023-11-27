import React, { useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Box,
    Modal,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../../utils/services';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';

const ApproverPage = () => {
    const navigate = useNavigate();
    const approverData = useSelector((state) => state.ApproverDataReducer.data);
    const loginData = useSelector((state) => state.auth.user);
    const [openModal, setOpenModal] = useState(false);
    const [allValues,setAllValues]=useState({
        title: '',
        amount: null,
        description: '',
        category: '',
      });
    const [projectOptions, setprojectOptions] = useState([]);
    const [SubprojectOptions, setSubprojectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedSubProject, setSelectedSubProject] = useState('');
    const [updatedFiles,setUpdatedfiles]=useState();
    const [allCategory,setAllCategory]=useState([]);
    const [noteChange,setNoteChange]=useState('');
    const [loading, setloading] = useState(false);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');
    const handleOpenModal = () => {
        setOpenModal(true);
      };
    const handleCloseModal = () => {
        setOpenModal(false);
      };

      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpen(false);
      };
    
      useEffect(() => {
        axios({
          method: 'get',
          url: `${baseURL}/api/project-query/list-categories`,
          headers: {
            Authorization: `Bearer ${loginData.jwt}`,
          },
        })
          .then((res) => {
            console.log('Response:', res.data);
            setAllCategory(res.data);
          })
          .catch((err) => {
            console.log('Error:', err);
          });
      }, []);

      useEffect(() => {
        axios({
          method: 'get',
          url: `${baseURL}/api/project-query/all`,
          headers: {
            Authorization: `Bearer ${loginData.jwt}`,
          },
        })
          .then((res) => {
            console.log('Response:', res.data);
            setprojectOptions(res.data);
          })
          .catch((err) => {
            console.log('Error:', err);
          });
      }, []);

      useEffect(()=>{
        if(approverData != null){
          axios({
            method: 'get',
            url: `${baseURL}/api/report/${approverData.id}`,
            headers: {
              Authorization: `Bearer ${loginData.jwt}`,
            },
          })
            .then((res) => {
              console.log('Response: exp', res.data);
              setAllValues(res.data);
              setUpdatedfiles(res.data.files)
              setSelectedProject(res.data.projectID);
              axios({
                method: 'get',
                url: `${baseURL}/api/project-query/sub-project/all/${res.data.projectID}`,
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
                });
              setSelectedSubProject(res.data.subProjectId)
    
            })
            .catch((err) => {
              console.log('Error:', err);
            });
        }else{
            navigate('/approver')
        }
      },[])

      const handleNoteChange=(e)=>{
        setNoteChange(e.target.value)
      }
      const handleApprove=()=>{
        setloading(true)
          const obj = {
              id: approverData.id,
              approvalStatus: "APPROVED",
              approverNote: null,
              subProjectId: selectedSubProject,
          }
          axios({
              method: 'put',
              url: `${baseURL}/api/report`,
              headers: {
                  Authorization: `Bearer ${loginData.jwt}`,
              },
              data: obj
          })
              .then((res) => {
                  console.log("res report", res)
                  setloading(false)
                  setOpen(true);
                  setSeverity("success");
                  setMsg('Approved.')
                  setTimeout(() => {
                    navigate(-1);
                  }, 1000);
              })
              .catch((err) => {
                  console.log("err", err)
                  setloading(false)
                  setOpen(true);
                  setSeverity("error");
                  setMsg('Error while approving.')
              });
      }
    const handleRejectSend=()=>{
        setloading(true);
        const obj = {
            id:approverData.id,
            approvalStatus: "REJECTED",
            approverNote: noteChange,
            subProjectId:selectedSubProject,
            
        }
        axios({
            method: 'put',
            url: `${baseURL}/api/report`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
            data: obj
        })
            .then((res) => {
                console.log("res report", res);
                setloading(false)
                setOpenModal(false);
                setOpen(true);
                setSeverity("success");
                setMsg('Rejected.');
                setTimeout(() => {
                    navigate(-1);
                  }, 1000);
            })
            .catch((err) => {
                console.log("err", err);
                setloading(false)
                setOpenModal(false);
                setOpen(true);
                setSeverity("error");
                setMsg('Error while Rejecting.')
            });
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
            <Header name={'Expense Report'}/>
            <Paper elevation={0} sx={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
                {/* <Typography sx={{ fontSize: '25px', fontWeight: '500' }}>
                    Expense Report
                </Typography> */}
                <form>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Project</InputLabel>
                        <Select
                            label="Project"
                            size="medium"
                            value={selectedProject}
                            sx={{ textAlign: 'left' }}
                            disabled
                        >
                            {projectOptions && projectOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Sub Project</InputLabel>
                        <Select
                            label="Sub Project"
                            size="medium"
                            value={selectedSubProject}
                            sx={{ textAlign: 'left' }}
                            disabled
                        >
                            {SubprojectOptions && SubprojectOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        margin="normal"
                        disabled
                        value={allValues.title}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        multiline
                        rows={2}
                        margin="normal"
                        disabled
                        value={allValues.description}
                    />
                    {
                        allValues.approverNote != null &&
                        <TextField
                        label="Reason"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        multiline
                        rows={2}
                        margin="normal"
                        disabled
                        value={allValues.approverNote}
                    />
                    }
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        margin="normal"
                        disabled
                        value={allValues.amount}
                        InputLabelProps={{
                            shrink: true, // This ensures the label stays floating
                          }}
                    />
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select
                            label="Category"
                            size="medium"
                            name="category"
                            value={allValues.category}
                            disabled
                            sx={{ textAlign: 'left' }}
                        >
                            {allCategory && allCategory.map((option) => (
                                <MenuItem key={option.id} value={option.name}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '16px', marginTop: '10px' }}>
                        {updatedFiles && updatedFiles.length > 0  && (
                            <ul>
                                {updatedFiles.map((file, index) => {
                                    const parts = file.location.split('\\');
                                    const filename = parts[parts.length - 1];

                                    return (
                                        <li key={index} onClick={()=>downloadZip(file.location)} style={{ display: 'flex', gap: '10px',marginTop:'5px'}}>
                                            {filename}{' '}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        <Button disabled={ allValues.approvalStatus !== "IN_APPROVAL" } variant="contained" fullWidth color="primary" sx={{ textTransform: 'none' }} onClick={handleApprove}>
                            Approve
                        </Button>
                        <Button disabled={ allValues.approvalStatus !== "IN_APPROVAL" } onClick={()=>handleOpenModal()} variant="contained" fullWidth color="error" sx={{ textTransform: 'none' }}>
                            Reject
                        </Button>
                    </Box>
                </form>

            </Paper>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="password-reset-modal"
                aria-describedby="password-reset-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'white',
                        boxShadow: 24,
                        p: 2,
                        outline: 'none',
                        borderRadius: '4px',
                    }}
                >
                    <Typography variant="h6">Reject Reason</Typography>
                    <TextField
                        label="Reason"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        multiline
                        rows={2}
                        margin="normal"
                        value={noteChange}
                        onChange={handleNoteChange}
                    />
                    <Box sx={{display:'flex',gap:'30px'}}>
                        <Button
                            onClick={()=>handleCloseModal()}
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '16px', textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            style={{ marginTop: '16px', textTransform: 'none' }}
                            onClick={handleRejectSend}
                            disabled={!noteChange}
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>

        </Container>
    );
};

export default ApproverPage;
