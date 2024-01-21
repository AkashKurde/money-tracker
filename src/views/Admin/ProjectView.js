import React, { useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
    Modal,
    Box
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import axios from 'axios';
import { baseURL } from '../../utils/services';


const ProjectView = () => {
    const data=useSelector(state=>state.AdminDataReducer.data);
    const loginData = useSelector(state => state.auth.user);
    const [projectOptions, setprojectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const navigate=useNavigate();
    const [allValues,setAllValues]=useState({
        title:'',
        description:'',
        amount:'',
        category:'',
        approverNote:''

    });
    const [files,setFiles]=useState('');
    const [SubprojectOptions, setSubprojectOptions] = useState([]);
    const [selectedSubProject, setSelectedSubProject] = useState('');
    const [allCategory,setAllCategory]=useState([]);
    const [loading,setloading]=useState(false);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');
    const [openModal, setOpenModal] = useState(false);
    const [noteChange,setNoteChange]=useState('');

    const handleNoteChange=(e)=>{
        setNoteChange(e.target.value)
      }
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

    useEffect(()=>{
        if(data != null){
            axios({
                method: 'get',
                url: `${baseURL}/api/report/${data.id}`,
                headers: {
                  Authorization: `Bearer ${loginData.jwt}`,
                },
              })
                .then((res) => {
                  console.log('Response: exp', res.data);
                  setAllValues(res.data);
                  setFiles(res.data.files)
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
            navigate(-1)
        }
        
    },[])
    //get all project
    useEffect(() => {
        axios({
            method: 'get',
            url: `${baseURL}/api/projects/all/0`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response:", res.data);
                setprojectOptions(res.data.content);
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }, [])

    //get all category
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

    const downloadZip = (filepath) => {
        const url = filepath;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleChange = (e)=>{
        setAllValues((inputField) => ({
            ...inputField,
            [e.target.name]: e.target.value,
        }));
    }

    const handleUpdate=()=>{
        setloading(true);
        axios({
            method: 'put',
            url: `${baseURL}/api/report`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
            data: allValues
        }).then((res) => {
            console.log("res report", res)
            setloading(false);
            setOpen(true);
            setSeverity('success');
            setMsg('Updated Successfully.')
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        })
            .catch((err) => {
                console.log("err", err)
                setloading(false);
                setOpen(true);
                setSeverity('error');
                setMsg('Error in Updating')
            });
    }

    const handleRejectSend=()=>{
        setloading(true);
        const obj = {
            id:data.id,
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
            
                <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="project-label">Project</InputLabel>
                        <Select
                            labelId="project-label"
                            id="project-select"
                            label='Project'
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
                    {/* <TextField
                        label="Title"
                        name='title'
                        variant="outlined"
                        fullWidth
                        size='medium'
                        margin="normal"
                        onChange={handleChange}
                        disabled={allValues.approvalStatus === "REJECTED"}
                        value={allValues.title}
                    /> */}
                    <TextField
                        label="Description"
                        name='description'
                        variant="outlined"
                        fullWidth
                        size='medium'
                        multiline
                        rows={2}
                        margin="normal"
                        onChange={handleChange}
                        disabled={allValues.approvalStatus === "REJECTED"}
                        value={allValues.description}
                    />
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        name='amount'
                        size='medium'
                        margin="normal"
                        onChange={handleChange}
                        disabled={allValues.approvalStatus === "REJECTED"}
                        value={allValues.amount}
                    />
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        size="medium"
                        name="category"
                        value={allValues.category}
                        sx={{ textAlign: 'left' }}
                        disabled={allValues.approvalStatus === "REJECTED"}
                        onChange={(e)=>{
                            setAllValues((inputField) => ({
                                ...inputField,
                                category: e.target.value,
                            }));
                        }}
                    >
                        {allCategory && allCategory.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                    {allValues.approvalStatus === "REJECTED" &&
                        <TextField
                            label="Reason"
                            variant="outlined"
                            fullWidth
                            size='medium'
                            multiline
                            rows={2}
                            disabled={allValues.approvalStatus === "REJECTED"}
                            value={allValues.approverNote}
                            margin="normal"
                        />}
                
                {files && files.length > 0  && (
                    <ul>
                        {files.map((file, index) => {
                            const parts = file.location.split('/');
                            const filename = parts[parts.length - 1];

                            return (
                                <li key={index} onClick={()=>downloadZip(file.location)} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    {filename}{' '}
                                </li>
                            );
                        })}
                    </ul>
                )}

                {(allValues.approvalStatus !== "REJECTED"  && allValues.approvalStatus !== 'IN_APPROVAL') &&
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ textTransform: 'none' }}
                        onClick={handleUpdate}
                    >Update</Button>}
                {allValues.approvalStatus === 'IN_APPROVAL' &&
                    <div style={{display:'flex',flexDirection:'column',gap:'15px'}}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            sx={{ textTransform: 'none' }}
                            onClick={handleUpdate}
                        >Approve</Button>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ textTransform: 'none'}}
                            color="error"
                            onClick={handleOpenModal}
                        >Reject</Button>
                    </div>
                }
            </Paper>
            <Snackbar sx={{ top: '75px' }} open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>

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
                    <Box sx={{ display: 'flex', gap: '30px' }}>
                        <Button
                            onClick={() => handleCloseModal()}
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
        </Container>
    );
};

export default ProjectView;
