import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Alert, Backdrop, BottomNavigation, BottomNavigationAction, Box, Button, Card, CardContent, CircularProgress, Container, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, Menu, MenuItem, Paper, Select, Snackbar, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Fade from '@mui/material/Fade';
import { height } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '../../utils/services';
import Header from '../Header';
import { ADMIN_PRJ_ID, STATUS } from '../../redux/actionTypes';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonIcon from '@mui/icons-material/Person';
const AdminDashboard = () => {
    const dispatch = useDispatch();
    const loginData = useSelector(state => state.auth.user);
    const [projectOptions, setprojectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedSubProject, setSelectedSubProject] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [SubprojectOptions, setSubprojectOptions] = useState([]);
    const [adminCards, setadminCards] = useState({
        approved: 0,
        rejected: 0,
        totalSpent: 0,
        fundAllocated: 0,
        pendingApprovals: 0,
        fundReceived:0
    });
    const [bottomSelectedValue, setBottomSelectedValue] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [categoryText, setCategoryText] = useState('');
    const [addedCategories, setAddedCategories] = useState([]);
    const [resCategory,setResCategory]=useState([]);
    const [deleteFlag,setDeleteFlag]=useState(false);
    const [loading, setloading] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');

    useEffect(()=>{
        dispatch({type: ADMIN_PRJ_ID, payload: null })

    },[])
    const handleClosetoast = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenToast(false);
      };
    
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleApproved = () => {
        dispatch({ type: STATUS, payload: 'APPROVED' })
        navigate('/admin-projectlist')
    }
    const handleRejected = () => {
        dispatch({ type: STATUS, payload: 'REJECTED' })
        navigate('/admin-projectlist')
    }
    const handleInApprovals = () => {
        dispatch({ type: STATUS, payload: 'IN_APPROVAL' })
        navigate('/admin-projectlist')
    }
    const handleFundReceived = () => {
        navigate('/fund-received')
    }
    //get all project
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
    }, [])

    //initial dashboard
    useEffect(() => {
        axios({
            method: 'get',
            url: `${baseURL}/api/admin/dashboard`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response:", res.data);
                setadminCards(res.data)
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }, [])


    const handleProjectChange = (event) => {
        const selectedProject = event.target.value;
        dispatch({type: ADMIN_PRJ_ID, payload: selectedProject })
        setSelectedProject(selectedProject);
        axios({
            method: 'get',
            url: `${baseURL}/api/project-query/sub-project/all/${selectedProject}`,
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
        //filter admin cards with project
        axios({
            method: 'get',
            url: `${baseURL}/api/admin/dashboard/project/${selectedProject}`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response: filter", res);
                setadminCards(res.data);
                
            })
            .catch((err) => {
                console.log("Error filter:", err);
                setadminCards({
                    approved: 0,
                    rejected: 0,
                    totalSpent: 0,
                    fundAllocated: 0,
                    pendingApprovals: 0,
                    fundReceived:0
                })
            });
    };
    const handleSubProjectChange = (event) => {
        const selectedSubProject = event.target.value;
        setSelectedSubProject(selectedSubProject);
        axios({
            method: 'get',
            url: `${baseURL}/api/admin/dashboard/${selectedSubProject}`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response: admin", res.data);
                setadminCards(res.data)
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    };

    const handleChangeBottom = (event, newValue) => {
        setBottomSelectedValue(newValue);
        if (newValue == 0) {
            navigate('/register');
        }
        if (newValue == 1) {
            navigate('/project');
        }
        if (newValue == 2) {
            setOpenModal(true);
            setAddedCategories([]);
            setCategoryText('');
        }
        if(newValue == 3){
            navigate('/users')
        }
    };
    const handleModalClose = () => {
        setOpenModal(false);
    };
    const handleAddCategory = () => {
        if (categoryText.trim() !== '') {
            setAddedCategories((prevCategories) => [...prevCategories, categoryText.trim()]);
            setCategoryText('');
        }
    };

    const handleDeleteCategory = (index) => {
        setAddedCategories((prevCategories) => prevCategories.filter((_, i) => i !== index));
    };
    const handleDeleteCategoryApi = (id) =>{
        axios({
            method: 'delete',
            url: `${baseURL}/api/project-mgmt/category`,
            headers: {
              Authorization: `Bearer ${loginData.jwt}`,
            },
            data:[id]
          })
            .then((res) => {
              console.log('Response: delete', res.data);
              setDeleteFlag( !deleteFlag )
            })
            .catch((err) => {
              console.log('delete:', err);
            });
    }

    const handleSaveCategories = () => {
        setloading(true)
        axios({
            method: 'post',
            url: `${baseURL}/api/project-mgmt/category`,
            headers: {
              Authorization: `Bearer ${loginData.jwt}`,
            },
            data: addedCategories
          })
            .then((res) => {
              console.log('Response:', res.data);
              setloading(false)
              setOpenToast(true);
              setSeverity('success')
              setMsg(res.data)
              handleModalClose();
            })
            .catch((err) => {
              console.log('Error:', err);
              setloading(false)
              setOpenToast(true);
              setSeverity('error')
              setMsg('Error in saving')
            });
        
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
            setResCategory(res.data);
          })
          .catch((err) => {
            console.log('Error:', err);
          });
      }, [deleteFlag,openModal]);
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
            <Header name={'Dashboard'}/>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '95%',
                    marginTop: '10px',
                }}
            >
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel id="project-label">Project</InputLabel>
                    <Select
                        labelId="project-label"
                        id="project-select"
                        label='Project'
                        value={selectedProject}
                        onChange={handleProjectChange}
                    >
                        {projectOptions && projectOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Box>
            {/* <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '95%',
                }}
            >
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Sub Project</InputLabel>
                    <Select
                        label="Sub Project"
                        size="medium"
                        value={selectedSubProject}
                        onChange={handleSubProjectChange}
                        sx={{ textAlign: 'left' }}
                    >
                        {SubprojectOptions && SubprojectOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box> */}
            <Box sx={{ overflowY: 'auto', flex: 1 }}>
            <Grid container spacing={2} sx={{ marginTop: '5px',marginBottom:'60px', paddingLeft: '10px', paddingRight: '10px' }}>

                <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingBottom: '10px',
                            textAlign: 'center',
                            height: '130px'
                        }}
                        onClick={handleApproved}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px' }}>
                            {adminCards.approved}
                        </Typography>
                        <Typography variant="h6">Approved</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingBottom: '10px',
                            textAlign: 'center',
                            height: '130px'
                        }}
                        onClick={handleRejected}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px' }}>
                            {adminCards.rejected}
                        </Typography>
                        <Typography variant="h6">Rejected</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingBottom: '10px',
                            textAlign: 'center',
                            height: '130px'
                        }}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px' }}>
                            {adminCards.totalSpent}
                        </Typography>
                        <Typography variant="h6">Total Spent</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingBottom: '10px',
                            textAlign: 'center',
                            height: '130px'
                        }}
                        
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px' }}>
                            {adminCards.fundAllocated}
                        </Typography>
                        <Typography variant="h6">Fund Allocated</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingBottom: '10px',
                            textAlign: 'center',
                            height: '130px'
                        }}
                        onClick={handleInApprovals}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px' }}>
                            {adminCards.pendingApprovals}
                        </Typography>
                        <Typography variant="h6">Approvals</Typography>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={6} md={4} lg={3} xl={2}>
                    <Card
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            paddingBottom: '10px',
                            textAlign: 'center',
                            height: '130px'
                        }}
                        onClick={handleFundReceived}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px' }}>
                            {adminCards.fundReceived}
                        </Typography>
                        <Typography variant="h6">Fund Received</Typography>
                    </Card>
                </Grid>

            </Grid>
            </Box>
            <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
                <BottomNavigation
                    value={bottomSelectedValue}
                    onChange={handleChangeBottom}
                    showLabels
                >
                    <BottomNavigationAction label="Regsiter" icon={<PersonAddAltRoundedIcon />} />
                    <BottomNavigationAction label="Project" icon={<AddCircleIcon />} />
                    <BottomNavigationAction label="Category" icon={<AssignmentIcon />} />
                    <BottomNavigationAction label="Users" icon={<PersonIcon />} />
                </BottomNavigation>
            </Box>
            <Dialog open={openModal} onClose={handleModalClose}>
                <DialogContent>
                    <Typography sx={{ fontSize: '17px', fontWeight: '700' }}>Create Category :</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <TextField
                            autoComplete="off" 
                            label="Category"
                            variant="outlined"
                            fullWidth
                            size='small'
                            value={categoryText}
                            onChange={(e) => setCategoryText(e.target.value)}
                        />
                        
                        <IconButton onClick={handleAddCategory} sx={{ marginLeft: '10px' }}><AddBoxIcon sx={{width:'35px',height:'35px',color:'#1976d2'}}/></IconButton>
                        
                    </div>

                    <List sx={{ marginTop: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                        {resCategory && resCategory.map((category, index) => (
                            <ListItem key={category.id}>
                                <ListItemText sx={{ overflow: 'hidden', textOverflow: "ellipsis" }} primary={category.name} />
                                <IconButton onClick={() => handleDeleteCategoryApi(category.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                        {addedCategories && addedCategories.map((category, index) => (
                            <ListItem key={index}>
                                <ListItemText sx={{ overflow: 'hidden', textOverflow: "ellipsis" }} primary={category} />
                                <IconButton onClick={() => handleDeleteCategory(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItem>
                        ))}
                    </List>
                    <Button disabled={!addedCategories.length > 0} variant="contained" color="primary" onClick={handleSaveCategories} sx={{ marginTop: '25px',float:'right' }}>
                        Save
                    </Button>
                </DialogContent>
            </Dialog>

            <Snackbar sx={{ top: '75px' }} open={openToast} autoHideDuration={4000} onClose={handleClosetoast} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert variant='filled' onClose={handleClosetoast} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>
        </Container>

    )
}

export default AdminDashboard