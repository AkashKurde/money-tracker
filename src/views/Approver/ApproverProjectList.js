import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Backdrop, Box, Card, CardContent, CircularProgress, Container, FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Fade from '@mui/material/Fade';
import { useDispatch, useSelector } from 'react-redux';
import { APPROVER_DATA } from '../../redux/actionTypes';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../utils/services';
import axios from 'axios';
import Header from '../Header';
const dateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60px', // Fixed width for the month and date part
    borderRight: '2px solid black', // Add border to the right side
    paddingRight: '20px', // Add some padding to separate text from border
};
const cardAlign={
    maxWidth: "200px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
const ApproverProjectList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [approverReport,setApproverReport]=useState([]);
    const [projectOptions, setprojectOptions] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [projectName, setProjectName] = useState('');
    const loginData = useSelector((state) => state.auth.user);
    const open = Boolean(anchorEl);
    const [loading, setloading] = useState(false);


    useEffect(()=>{
        dispatch({ type: APPROVER_DATA, payload: null })
    },[])
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSendData = (val) => {
        dispatch({ type: APPROVER_DATA, payload: val })
        navigate('/approver-page')
    }

    useEffect(() => {
        axios({
          method: 'get',
          url: `${baseURL}/api/report/by-approver`,
          headers: {
            Authorization: `Bearer ${loginData.jwt}`,
          },
        })
          .then((res) => {
            console.log('Response: report get', res.data);
            setApproverReport(res.data);
          })
          .catch((err) => {
            console.log('Error:', err);
            setApproverReport([])
          });
      }, []);

       //get all project
    useEffect(() => {
        axios({
            method: 'get',
            url: `${baseURL}/api/report/subprojects-list/`,
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

    const handleProjectChange = (event) => {
        const selectedProject = event.target.value;
        setSelectedProject(selectedProject);
        setProjectName(selectedProject);
        setApproverReport([]);
       
        // api call after project change
        setloading(true);
        axios({
            method: 'get',
            url: `${baseURL}/api/report/by-subproject/${selectedProject}`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log('Response: report get', res.data);
                setloading(false);
                setApproverReport(res.data);
            })
            .catch((err) => {
                console.log('Error:', err);
                setloading(false);
                setApproverReport([])
            });
    };
    

    const handleApproved = () => {
        setSelectedProject('')
        axios({
            method: 'get',
            url: `${baseURL}/api/report/by-approver-and-status/APPROVED`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log('Response: report get', res.data);
                setApproverReport(res.data);
            })
            .catch((err) => {
                console.log('Error:', err);
                setApproverReport([])
            });
            setAnchorEl(null);  
    }
    const handleRejected = () => {
        setSelectedProject('')
        axios({
            method: 'get',
            url: `${baseURL}/api/report/by-approver-and-status/REJECTED`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log('Response: report get', res.data);
                setApproverReport(res.data);
            })
            .catch((err) => {
                console.log('Error:', err);
                setApproverReport([])
            });
            setAnchorEl(null);  
    }
    const gotoMyProjects =()=>{
        setAnchorEl(null);
        navigate('/projectlist')
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
            <Header name={'Report List'}/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    marginTop: '10px',
                    paddingLeft:'20px'
                }}
            >
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Project</InputLabel>
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

                <IconButton
                    id="fade-button"
                    aria-controls={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon sx={{ width: '44px', height: '44px', color: '#a19a9' }} />
                </IconButton>
                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={handleApproved}>Approved</MenuItem>
                    <MenuItem onClick={handleRejected}>Rejected</MenuItem>
                    <MenuItem onClick={gotoMyProjects}>My Reports</MenuItem>
                </Menu>
            </Box>

            {approverReport.length === 0 ? (
                <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
                    No data available
                </Typography>
            ) : (
                    <Grid container spacing={2} sx={{ marginTop: '25px',paddingLeft:'10px',paddingRight:'10px' }}>
                        {approverReport &&
                            approverReport.map((val) => {
                                // Parse the date string from 'val' to create a Date object
                                const date = new Date(val.createdAt); // Replace 'date' with the actual date property in 'val'

                                // Define options for formatting the date
                                const options = { day: 'numeric', month: 'short' };

                                // Format the date using Intl.DateTimeFormat
                                const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

                                // Split the formatted date into day and month
                                const [day, month] = formattedDate.split(' ');

                                return (
                                    <Grid key={val.id} item xs={12} sm={6} md={4}>
                                        <Card
                                            onClick={() => handleSendData(val)}
                                            sx={{ display: 'flex', alignItems: 'center', gap:'20px'}}
                                        >
                                            <CardContent sx={dateStyle}>
                                                <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>{day}</Typography>
                                                <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>{month}</Typography>
                                            </CardContent>
                                            <div style={{display:'flex',flexDirection:'column'}}>
                                                <div>
                                                    <Typography variant="h6" style={cardAlign}>{val.title}</Typography>
                                                </div>
                                                <div >
                                                    <Typography sx={{ fontSize: '15px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'175px'}}>{`Reported By ${val.username}`}</Typography>
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                );
                            })
                        }

                    </Grid>
            )}
            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>
        </Container>
    )
}

export default ApproverProjectList