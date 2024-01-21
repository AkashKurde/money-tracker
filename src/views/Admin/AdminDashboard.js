import { Alert, Backdrop, BottomNavigation, BottomNavigationAction, Box, Button, Card, CardContent, CircularProgress, Container, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, Menu, MenuItem, Modal, Paper, Select, Snackbar, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL } from '../../utils/services';
import Header from '../Header';
import { ADMIN_DATA, ADMIN_PRJ_ID, SET_ALL_CHECK, SET_DATE, SET_SUBPROJ_ID, STATUS, USER_PROFIT_DATA } from '../../redux/actionTypes';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 255,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display:'flex',
    flexDirection:'column'
  };
const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loginData = useSelector(state => state.auth.user);
    const [projectOptions, setprojectOptions] = useState([]);
    const [adminCards, setadminCards] = useState({
        approved: 0,
        rejected: 0,
        totalSpent: 0,
        fundAllocated: 0,
        pendingApprovals: 0,
        fundReceived:0,
        totalEarnings:0
    });
    const [bottomSelectedValue, setBottomSelectedValue] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [openModalFile, setOpenModalFile] = useState(false);
    const [categoryText, setCategoryText] = useState('');
    const [addedCategories, setAddedCategories] = useState([]);
    const [resCategory,setResCategory]=useState([]);
    const [deleteFlag,setDeleteFlag]=useState(false);
    const [loading, setloading] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');
    const [selectedProjectFile, setSelectedProjectFile] = useState('');
    const [reportType, setReportType] = useState('');
    const [reportFile,setReportFile]=useState('');

    //initail null check
    useEffect(()=>{
        dispatch({type: ADMIN_PRJ_ID, payload: null });
        dispatch({ type: STATUS, payload: null });
        dispatch({type:SET_ALL_CHECK,payload:false});
        dispatch({
            type: SET_DATE, payload: {
              startDate: null,
              endDate: null
            }
          });
        dispatch({ type: ADMIN_DATA, payload: null });
        dispatch({type: USER_PROFIT_DATA ,payload: null});
        dispatch({type:SET_SUBPROJ_ID,payload:''})
    },[]);

    const handleClosetoast = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenToast(false);
      };
    
    const handleShowAdminData = () => {
        navigate('/admin-projectlist')
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

    const handleChangeBottom = (event, newValue) => {
        setBottomSelectedValue(newValue);
        if (newValue == 0) {
            navigate('/register');
        }
        if (newValue == 1) {
            navigate('/sub-project-list');
        }
        if (newValue == 2) {
            setOpenModal(true);
            setAddedCategories([]);
            setCategoryText('');
        }
        if(newValue == 3){
            setOpenModalFile(true);
            setSelectedProjectFile('');
            setReportType('');
            setReportFile('')
        }
    };
    const handleModalClose = () => {
        setOpenModal(false);
        setBottomSelectedValue('');
    };
    const handleModalCloseFile = () => {
        setBottomSelectedValue('');
        setOpenModalFile(false);
        setSelectedProjectFile('');
        setReportType('');
        setReportFile('')
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

   // get donwload report 
    useEffect(()=>{
        if (selectedProjectFile !== '' && reportType !== '') {
            axios({
                method: 'get',
                url: `${baseURL}/api/admin/export-as-file/${selectedProjectFile}/${reportType}`,
                headers: {
                    Authorization: `Bearer ${loginData.jwt}`,
                },
            })
                .then((res) => {
                    console.log('Response:', res.data);
                    setReportFile(res.data)

                })
                .catch((err) => {
                    console.log('Error:', err);
                    setReportFile('')
                    setOpenToast(true);
                    setSeverity('error')
                    setMsg('Error fetching report')
                });
        }
    },[selectedProjectFile,reportType])
    
    // donwload report
    const handleDownloadFile = ()=>{
        const url = reportFile;
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
            <Header name={'Dashboard'}/>
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
                            onClick={() => handleShowAdminData()}
                        >
                            <Typography sx={{ fontSize: '26px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                My Account
                            </Typography>
                            <Typography variant="h6">Click here</Typography>
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
                        // onClick={handleApproved}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
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
                        // onClick={handleRejected}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
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
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
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
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
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
                        // onClick={handleInApprovals}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
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
                        // onClick={handleFundReceived}
                    >
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
                            {adminCards.fundReceived}
                        </Typography>
                        <Typography variant="h6">Fund Received</Typography>
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
                        <Typography sx={{ fontSize: '28px', fontWeight: 'bold', width: '100%', background: '#c5c5c5', padding: '25px',overflow:'hidden',textOverflow:'ellipsis' }}>
                            {adminCards.totalEarnings}
                        </Typography>
                        <Typography variant="h6">Total Earnings</Typography>
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
                    <BottomNavigationAction label="File" icon={<SimCardDownloadIcon />} />
                </BottomNavigation>
            </Box>
            {/* category model */}
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
            {/* File download model  */}
            <Modal
                open={openModalFile}
                onClose={handleModalCloseFile}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                <Typography sx={{ fontSize: '17px', fontWeight: '700',marginBottom:'15px' }}>File Download :</Typography>
                    <FormControl sx={{marginTop:'5px'}} fullWidth variant="outlined" margin="normal">
                        <InputLabel id="project-label">Project</InputLabel>
                        <Select
                            labelId="project-label"
                            id="project-select"
                            label='Project'
                            value={selectedProjectFile}
                            onChange={(e)=>setSelectedProjectFile(e.target.value)}
                        >
                            {projectOptions && projectOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{marginTop:'5px'}} fullWidth variant="outlined" margin="normal">
                        <InputLabel id="project-label">Report type</InputLabel>
                        <Select
                            labelId="project-label"
                            id="project-select"
                            label='Report type'
                            value={reportType}
                            onChange={(e)=>setReportType(e.target.value)}
                        >
                            <MenuItem  value='refund'>Refund</MenuItem>
                            <MenuItem  value='expense'>Expense</MenuItem>
                            <MenuItem  value='all'>All</MenuItem>
                        </Select>
                    </FormControl>
                    <Button disabled={(selectedProjectFile === '' || reportType === '') || reportFile === ''} variant="contained" color="primary"  sx={{ marginTop: '25px',textTransform:'none'}} onClick={handleDownloadFile}> Download </Button>
                </Box>
            </Modal>
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