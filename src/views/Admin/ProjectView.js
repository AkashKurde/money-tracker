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
                    <TextField
                        label="Amount"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        margin="normal"
                        disabled
                        value={allValues.amount}
                    />
                    <TextField
                        label="Category"
                        variant="outlined"
                        fullWidth
                        size='medium'
                        margin="normal"
                        disabled
                        value={allValues.category}
                    />
                    {allValues.approvalStatus !== "REJECTED" &&
                        <TextField
                            label="Reason"
                            variant="outlined"
                            fullWidth
                            size='medium'
                            multiline
                            rows={2}
                            disabled
                            value={allValues.approverNote}
                            margin="normal"
                        />}
                </form>
                {files && files.length > 0  && (
                    <ul>
                        {files.map((file, index) => {
                            const parts = file.location.split('\\');
                            const filename = parts[parts.length - 1];

                            return (
                                <li key={index} onClick={()=>downloadZip(file.location)} style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                    {filename}{' '}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Paper>
        </Container>
    );
};

export default ProjectView;
