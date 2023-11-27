import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Grid,
    Dialog,
    DialogContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    List,
    ListItem,
    ListItemText,
    InputAdornment,
    Snackbar,
    Alert,
    Backdrop,
    CircularProgress,
    Chip,
} from '@mui/material';
import axios from 'axios';
import { baseURL } from '../utils/services';
import { useSelector } from 'react-redux';
import Header from './Header';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { flexbox } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const ProjectPage = () => {
    const navigate=useNavigate();
    const [isSameProject, setIsSameProject] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [subProjectName, setSubProjectName] = useState('');
    const [fundAllocated, setFundAllocated] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [limitTransaction, setLimitTransaction] = useState('');
    const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [projectOptions, setprojectOptions] = useState([]);
    const loginData = useSelector(state => state.auth.user);
    const [members, setMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [projectTxt, setProjectText] = useState('');
    const [descriptionTxt, setdescriptionText] = useState('');
    const [projectFlag, setProjectFlag] = useState(false)
    const [loading, setloading] = useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');

    useEffect(() => {
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

        setStartDate(formattedFirstDay);
        setEndDate(formattedLastDay);
    }, []);

    const handleClosetoast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenToast(false);
    };

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
    }, [projectFlag])




    const handleSameProjectChange = (event) => {
        setIsSameProject(event.target.checked);
        if (event.target.checked) {
            if (selectedProject) {
                const result = projectOptions && projectOptions.find(item => item.id === selectedProject);
                setSubProjectName(result.title);
            }

        } else {
            setSubProjectName('');
        }
    };

    const handleAddEmployeeClick = () => {
        setOpenEmployeeModal(true);
    };

    //approver check
    const handleEmployeeSelection = (employee) => {
        const isSelected = selectedEmployees.some((e) => e.id === employee.id);
        let updatedSelectedEmployees;

        if (isSelected) {
            // Deselect the employee
            updatedSelectedEmployees = selectedEmployees.filter((e) => e.id !== employee.id);
        } else {
            // Select the employee
            updatedSelectedEmployees = [...selectedEmployees, employee];
        }

        const updatedMembers = updatedSelectedEmployees.map((e) => e.id);
        setMembers(updatedMembers);
        setSelectedEmployees(updatedSelectedEmployees);
    };

    const handleEmployeeModalClose = () => {
        setOpenEmployeeModal(false);
    };

    const handleProjectChange = (event) => {
        const selectedProject = event.target.value;
        setSelectedProject(selectedProject);
        setProjectName(selectedProject);
    };


    const handleStartDateChange = (event) => {
        const newStartDate = event.target.value;
        setStartDate(newStartDate);
        if (endDate < newStartDate) {
            setEndDate(newStartDate);
        }
    };

    const handleEndDateChange = (event) => {
        const newEndDate = event.target.value;
        if (newEndDate >= startDate) {
            setEndDate(newEndDate);
        }
    };


    const isEndDateValid = !startDate || endDate >= startDate;

    const handleSubmit = () => {
        const subProject = {
            projectId: selectedProject,
            title: subProjectName,
            note: subProjectName,
            notification: false,
            expense: fundAllocated,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            maxLimit: limitTransaction,
            members: members
        }
        axios({
            method: 'post',
            url: `${baseURL}/api/project-mgmt`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
            data: subProject
        })
            .then((res) => {
                console.log("Response:", res.data);
                setOpenToast(true);
                setSeverity('success')
                setMsg('Sub-Project Created Successfully')
                setTimeout(() => {
                    navigate(-1);
                  }, 1500);
            })
            .catch((err) => {
                console.log("Error:", err);
                setOpenToast(true);
                setSeverity('error')
                setMsg('Error...!')
            });

    }

    const handleSearch = (event) => {
        setSearchText(event.target.value);
        axios({
            method: 'post',
            url: `${baseURL}/api/authentication/search-by/name/${event.target.value}`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response:", res.data);

                // // Convert the single object to an array
                // const userDataArray = Array.isArray(res.data) ? res.data : [res.data];

                // // Filter users with "APPROVER" authority
                // const approverUsers = userDataArray.filter(user => (
                //   user.authorities.some(authority => authority.authority === "APPROVER")
                // ));

                setEmployeeList(res.data);
            })
            .catch((err) => {
                console.log("Error:", err);
                setEmployeeList([])
            });
    }


    // Validation function to check if all fields are filled
    const isFormValid = () => {
        return (
            projectName &&
            subProjectName &&
            fundAllocated &&
            startDate &&
            endDate &&
            limitTransaction &&
            selectedProject &&
            selectedEmployees.length > 0
        );
    };

    const handleCreateProject = () => {
        setOpenModal(true)
        setdescriptionText('');
        setProjectText('');
    }
    const handleModalClose = () => {
        setOpenModal(false);
    };
    const createProject = () => {
        setloading(true)
        axios({
            method: 'post',
            url: `${baseURL}/api/projects`,
            headers: {
                Authorization: `Bearer ${loginData.jwt}`,
            },
            data: {
                title: projectTxt,
                description: descriptionTxt
            }
        })
            .then((res) => {
                console.log('Response:', res.data);
                setProjectFlag(!projectFlag);
                setloading(false)
                setOpenToast(true);
                setSeverity('success')
                setMsg('Project Created Successfully')
                handleModalClose();
            })
            .catch((err) => {
                console.log('Error:', err);
                setloading(false)
                setOpenToast(true);
                setSeverity('error')
                setMsg('Error Creating Project')
            })
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
            <Header name={'Create Sub-Project'} />
            <Paper elevation={0} sx={{ padding: '16px', maxWidth: '600px', width: '90%', textAlign: 'center' }}>
                {/* <Typography sx={{ fontSize: '25px', fontWeight: '500' }}>
                    Create Sub-Project
                </Typography> */}
                <form>
                    <FormControl fullWidth variant="outlined" margin="normal">
                        <InputLabel id="project-label">Project/Client</InputLabel>
                        <Select
                            labelId="project-label"
                            id="project-select"
                            label='Project/Client'
                            value={selectedProject}
                            sx={{ textAlign: 'left' }}
                            onChange={handleProjectChange}
                            endAdornment={
                                <InputAdornment position="end" sx={{ marginRight: '10px' }}>
                                    <IconButton >
                                        <AddBoxIcon onClick={handleCreateProject} sx={{ width: '30px', height: '30px', color: '#1976d2' }} />
                                    </IconButton>
                                </InputAdornment>
                            }
                        >
                            {projectOptions && projectOptions.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSameProject}
                                onChange={handleSameProjectChange}
                                color="primary"
                            />
                        }
                        label="Project & Sub-Project is same"
                    />
                    <TextField
                        label="Sub-Project/Client"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={subProjectName}
                        onChange={(event) => setSubProjectName(event.target.value)}
                    />
                    <TextField
                        label="Fund Allocated in Advance"
                        variant="outlined"
                        fullWidth
                        type="number"
                        margin="normal"
                        value={fundAllocated}
                        onChange={(event) => setFundAllocated(event.target.value)}
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Start Date"
                                variant="outlined"
                                fullWidth
                                type="date"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={startDate}
                                onChange={handleStartDateChange}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="End Date"
                                variant="outlined"
                                fullWidth
                                type="date"
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={endDate}
                                onChange={handleEndDateChange}
                                disabled={!startDate}
                                error={!isEndDateValid}
                            />
                        </Grid>
                    </Grid>
                    {isEndDateValid ? null : (
                        <Typography variant="body2" color="error">
                            End date must be greater than or equal to the start date.
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '16px', textTransform: 'none' }}
                        onClick={handleAddEmployeeClick}
                    >
                        Add Employee
                    </Button>
                    {selectedEmployees.length > 0 && (
                        <List dense>
                            {selectedEmployees.map((employee) => (
                                <ListItem key={employee.id}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ width: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {employee.name}
                                        </div>
                                        <Chip label={employee.approver ? 'Approver' : 'User'} color="primary" sx={{width:'78px',height:'24px'}}/>
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <TextField
                        label="Limit/Transaction"
                        variant="outlined"
                        fullWidth
                        type="number"
                        margin="normal"
                        value={limitTransaction}
                        onChange={(event) => setLimitTransaction(event.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '16px' }}
                        onClick={() => handleSubmit()}
                        disabled={!isFormValid()}
                    >
                        Submit
                    </Button>
                </form>
            </Paper>
            <Dialog open={openEmployeeModal} onClose={handleEmployeeModalClose}>
                <DialogContent>
                    <Typography sx={{ fontSize: '25px', fontWeight: '500' }}>Select Employees:</Typography>
                    <TextField
                        label="Search Employees"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={searchText}
                        onChange={(event) => handleSearch(event)}
                    />
                    <div style={{ maxHeight: '290px', overflowY: 'auto' }}>
                        <List>
                            {employeeList && employeeList.map((employee) => (
                                <ListItem key={employee.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={selectedEmployees.some((e) => e.id === employee.id)}
                                                onChange={() => handleEmployeeSelection(employee)}
                                                color="primary"
                                            />
                                        }
                                        label={
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div style={{ width: '121px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                    {employee.name}
                                                </div>
                                                <Chip label={employee.approver ? 'Approver' : 'User'} color="primary" sx={{width:'78px',height:'24px'}} />
                                            </div>
                                        }
                                    />

                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '16px' }}
                        onClick={handleEmployeeModalClose}
                    >
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={openModal} onClose={handleModalClose}>
                <DialogContent>
                    <Typography sx={{ fontSize: '17px', fontWeight: '700' }}>Create Project :</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', flexDirection: 'column', gap: '10px' }}>
                        <TextField
                            autoComplete="off"
                            label="Project"
                            variant="outlined"
                            fullWidth
                            size='small'
                            value={projectTxt}
                            onChange={(e) => setProjectText(e.target.value)}
                        />
                        <TextField
                            autoComplete="off"
                            label="description"
                            variant="outlined"
                            fullWidth
                            size='small'
                            value={descriptionTxt}
                            onChange={(e) => setdescriptionText(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={createProject}
                            disabled={!projectTxt || !descriptionTxt}>
                            Create
                        </Button>
                    </div>
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
    );
};

export default ProjectPage;
