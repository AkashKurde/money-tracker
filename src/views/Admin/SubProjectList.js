import { Box, Container } from '@mui/system'
import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Backdrop, Button, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import axios from 'axios'
import { baseURL } from '../../utils/services'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ADMIN_PRJ_ID, SUB_PROJECT_DATA } from '../../redux/actionTypes'

const dateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '60px', // Fixed width for the month and date part
    borderRight: '2px solid black', // Add border to the right side
    paddingRight: '20px', // Add some padding to separate text from border
};

const cardAlign = {
    maxWidth: "200px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
}

const SubProjectList = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const [allReport, setAllReport] = useState([])
    const [loading, setloading] = useState(false);
    const loginData = useSelector((state) => state.auth.user);
    const projectId = useSelector(state => state.AdminProjectIDReducer.id);
    const [projectOptions, setprojectOptions] = useState([]);

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
                // if (projectId === null) {
                //     dispatch({ type: ADMIN_PRJ_ID, payload: res.data[0].id })
                // }
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }, []);

    // useEffect(() => {
    //     dispatch({type:SUB_PROJECT_DATA,payload:null})
    //     setloading(true)
    //     axios({
    //         method: 'get',
    //         url: `${baseURL}/api/projects/sub-project`,
    //         headers: {
    //             Authorization: `Bearer ${loginData.jwt}`,
    //         },
    //     })
    //         .then((res) => {
    //             console.log('Response: sub get', res.data);
    //             setloading(false)
    //             setAllReport(res.data);
    //         })
    //         .catch((err) => {
    //             console.log('Error:', err);
    //             setloading(false)
    //             setAllReport([])
    //         });
    // }, []);

    const handleCreateProject = () => {
        dispatch({type:SUB_PROJECT_DATA,payload:null})
        navigate('/project')
    }

    const handleClickCard = (val) =>{
        dispatch({type:SUB_PROJECT_DATA,payload:val})
        navigate('/project')
    }
    const handleProjectChange = (event) => {
        const selectedProject = event.target.value;
        dispatch({type:ADMIN_PRJ_ID,payload:selectedProject})
      }
      useEffect(() => {
        if (projectId !== null) {
          axios({
            method: 'get',
            url: `${baseURL}/api/project-query/sub-project/all/${projectId}`,
            headers: {
              Authorization: `Bearer ${loginData.jwt}`,
            },
          })
            .then((res) => {
              console.log('Response:', res.data);
              setAllReport(res.data);
            })
            .catch((err) => {
              console.log('Error:', err);
              setAllReport([])
            });
        }
      }, [projectId])
    return (
        <Container sx={{
            display: 'flex',
            flexDirection: 'column',  // To make sure the children stack vertically
            justifyContent: 'flex-start', // Start from the top
            alignItems: 'center', // Center horizontally
            minHeight: '100vh',
            p: 0, // Remove padding from the Container
        }}>
            <Header name={'Sub-Project List'} />

            <Button variant="contained" color="primary" fullWidth style={{ marginTop: '20px', textTransform: 'none',width:'95%' }} onClick={handleCreateProject}>Create Project</Button>
            <Box width='95%'>
                <FormControl sx={{ marginBottom: '0px' }} fullWidth variant="outlined" margin="normal">
                    <InputLabel>Project</InputLabel>
                    <Select
                        label="Project"
                        size="medium"
                        value={projectId}
                        onChange={handleProjectChange}
                        sx={{ textAlign: 'left' }}
                    >
                        {projectOptions && projectOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {allReport && allReport.length === 0 ? (
                <Typography sx={{ marginTop: '20px', textAlign: 'center' }}>
                    No data available
                </Typography>
            ) : (
                <Grid container spacing={2} sx={{ marginTop: '25px', paddingLeft: '10px', paddingRight: '10px' }}>
                    {allReport &&
                        allReport.map((val) => {
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
                                    <Card sx={{ display: 'flex', alignItems: 'center' }} onClick={()=>handleClickCard(val)}>
                                        <CardContent sx={dateStyle}>
                                            <Typography sx={{ fontSize: '25px', fontWeight: 'bold' }}>{day}</Typography>
                                            <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>{month}</Typography>
                                        </CardContent>
                                        <CardContent>
                                            <Typography variant="h6" style={cardAlign}>{val.title}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })
                    }

                </Grid>)}

            <Backdrop open={loading} style={{ zIndex: 9999, flexDirection: "column" }}>
                <CircularProgress sx={{ color: 'rgb(34, 41, 57)' }} size={50} />
            </Backdrop>
        </Container>
    )
}

export default SubProjectList