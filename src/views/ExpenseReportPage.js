import React, { useEffect, useState } from 'react';
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
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../utils/services';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
const ExpenseReportPage = () => {
  const navigate=useNavigate();
  const todayDate = new Date().toISOString().split('T')[0];
  const [SubprojectOptions, setSubprojectOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSubProject, setSelectedSubProject] = useState('');
  const [editMode,setEditmode]=useState(false);
  const [expenseDetails, setExpenseDetails] = useState({
    title: 'No Title',
    amount: null,
    description: '',
    category: '',
  });
  const [date,setDate]=useState(todayDate)
  const [files, setFiles] = useState();
  const [updatedFiles,setUpdatedfiles]=useState();
  const loginData = useSelector((state) => state.auth.user);
  const expenseData = useSelector((state) => state.ReportDataReducer.data);
  const [allCategory,setAllCategory]=useState([]);
  const [loading,setloading]=useState(false);
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [severity, setSeverity] = useState('success');

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
    const selectedSubProject = event.target.value;
    setSelectedSubProject(selectedSubProject);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseDetails({
      ...expenseDetails,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const filesVar = e.target.files;
    setFiles(Array.from(filesVar));

    if (editMode) {
      setloading(true)
      const formData = new FormData();
      for (let i = 0; i < filesVar.length; i++) {
        formData.append('files', filesVar[i]);
      }
      formData.append('reportId', expenseData.id);
      // Now you can send the formData to the server
      axios
        .post(`${baseURL}/api/report/update-file`, formData, {
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

  const handleSubmit = () => {
    setloading(true);
    // Create a FormData object to send files and data
    const formData = new FormData();
    if(files){
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }
    formData.append('subProjectId',selectedSubProject);
    formData.append('amount',expenseDetails.amount);
    formData.append('title',expenseDetails.title);
    formData.append('description',expenseDetails.description);
    formData.append('category',expenseDetails.category);
    formData.append('approvalStatus','IN_APPROVAL');
    formData.append('createdAt',new Date(date).toISOString());
    // Now you can send the formData to the server

    
    // axios
    //   .post(`${baseURL}/api/report`, formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data', // Important for sending files
    //       Authorization: `Bearer ${loginData.jwt}`,
    //     },
    //   })

    axios({
      method: "post",
      url: `${baseURL}/api/report`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${loginData.jwt}`,
      },
      data: formData,
    })
      .then((res) => {
        console.log("res report",res)
        setOpen(true);
        setSeverity('success');
        setMsg(res.data)
        setloading(false);
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
      .catch((err) => {
        console.log("err", err);
        setloading(false);
        setOpen(true);
        setSeverity('error');
        setMsg(err.response ? err.response.data.message : err.message)
      });
  };
  const handleDraft = () => {
    setloading(true);
    // Create a FormData object to send files and data
    const formData = new FormData();
    if(files){
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }
    formData.append('subProjectId',selectedSubProject);
    formData.append('amount',expenseDetails.amount);
    formData.append('title',expenseDetails.title);
    formData.append('description',expenseDetails.description);
    formData.append('category',expenseDetails.category);
    formData.append('approvalStatus','DRAFT');
    formData.append('createdAt',new Date(date).toISOString());
    // Now you can send the formData to the server
    axios
      .post(`${baseURL}/api/report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for sending files
          Authorization: `Bearer ${loginData.jwt}`,
        },
      })
      .then((res) => {
        console.log("res report",res);
        setOpen(true);
        setSeverity('success');
        setMsg(res.data)
        setloading(false);
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      })
      .catch((err) => {
        console.log("err", err);
        setloading(false);
        setOpen(true);
        setSeverity('error');
        setMsg(err.response ? err.response.data.message : err.message)
      });
  }
  const handleUpdate = () => {
    setloading(true);
    const obj={
      ...expenseDetails,
      subProjectId:selectedSubProject,
      approvalStatus: 'IN_APPROVAL',
      createdAt: new Date(date).toISOString()
    }
    axios({
      method: 'put',
      url: `${baseURL}/api/report`,
      headers: {
        Authorization: `Bearer ${loginData.jwt}`,
      },
      data:obj
    })
      .then((res) => {
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
  };
  const handleUpdateDraft = () => {
    setloading(true);
    const obj={
      ...expenseDetails,
      subProjectId:selectedSubProject,
      approvalStatus: 'DRAFT',
      createdAt: new Date(date).toISOString()
    }
    axios({
      method: 'put',
      url: `${baseURL}/api/report`,
      headers: {
        Authorization: `Bearer ${loginData.jwt}`,
      },
      data:obj
    })
      .then((res) => {
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
  };
  const [deleteFlag,setDeleteflag]=useState(false);
  useEffect(()=>{
    if(expenseData != null){
      setEditmode(true)
      axios({
        method: 'get',
        url: `${baseURL}/api/report/${expenseData.id}`,
        headers: {
          Authorization: `Bearer ${loginData.jwt}`,
        },
      })
        .then((res) => {
          console.log('Response: exp', res.data);
          setExpenseDetails(res.data);
          setDate(res.data.createdAt !== null && res.data.createdAt.split('T')[0])
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
      setEditmode(false)
    }
  },[deleteFlag])

  const handleDeleteFile=(id)=>{
    axios({
      method: 'delete',
      url: `${baseURL}/api/report/file/${id}`,
      headers: {
        Authorization: `Bearer ${loginData.jwt}`,
      },
    }).then((res)=>{
      console.log("res delete",res);
      setDeleteflag(!deleteFlag)
    }).catch((err)=>{
      console.log("err",err)
    })
  }

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };
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
      <Header name={'Create Expense'} />
      <Paper elevation={0} sx={{ padding: '16px', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
        <form>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Sub Project</InputLabel>
            <Select
              label="Sub Project"
              size="medium"
              value={selectedSubProject}
              onChange={handleSubProjectChange}
              sx={{ textAlign: 'left' }}
              disabled={expenseDetails.approvalStatus === "REJECTED"}
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
            name="title"
            variant="outlined"
            fullWidth
            size="medium"
            margin="normal"
            value={expenseDetails.title}
            onChange={handleChange}
            disabled={expenseDetails.approvalStatus === "REJECTED"}
          /> */}
          <TextField
            label="Description"
            name="description"
            variant="outlined"
            fullWidth
            size="medium"
            multiline
            rows={2}
            margin="normal"
            value={expenseDetails.description}
            onChange={handleChange}
            disabled={expenseDetails.approvalStatus === "REJECTED"}
          />
          <TextField
            label="Amount"
            name="amount"
            variant="outlined"
            fullWidth
            size="medium"
            type="number"
            margin="normal"
            value={expenseDetails.amount}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true, // This ensures the label stays floating
            }}
            disabled={expenseDetails.approvalStatus === "REJECTED"}
          />
          <TextField
            label="Date"
            variant="outlined"
            fullWidth
            type="date"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value={date}
            onChange={handleDateChange}
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              size="medium"
              name="category"
              value={expenseDetails.category}
              onChange={handleChange}
              sx={{ textAlign: 'left' }}
              disabled={expenseDetails.approvalStatus === "REJECTED"}
            >
              {allCategory && allCategory.map((option) => (
                <MenuItem key={option.id} value={option.name}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {expenseDetails.approvalStatus === "REJECTED" &&
            <TextField
              label="Reason"
              variant="outlined"
              fullWidth
              size='medium'
              multiline
              rows={2}
              margin="normal"
              disabled
              value={expenseDetails.approverNote}
            />}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px', marginTop: '10px' }}>
            <label htmlFor="file-upload">
              <Button disabled={expenseDetails.approvalStatus === "REJECTED" || expenseDetails.approvalStatus === "APPROVED" || expenseDetails.approvalStatus === "IN_APPROVAL" } variant="contained" fullWidth color="primary" component="span" sx={{ textTransform: 'none' }}>
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
            {updatedFiles && updatedFiles.length > 0 && editMode &&(
              <ul>
              {updatedFiles.map((file, index) => {
                const parts = file.location.split('/');
                const filename = parts[parts.length - 1];
                
                return (
                  <li key={index} onClick={()=>downloadZip(file.location)} style={{display:'flex',gap:'10px',marginTop:'5px'}}>
                    {filename}{' '}
                    <DeleteIcon  sx={{width:'19px',height:'19px', pointerEvents: (expenseDetails.approvalStatus === "REJECTED" || expenseDetails.approvalStatus === "APPROVED" || expenseDetails.approvalStatus === "IN_APPROVAL") && 'none', visibility: (expenseDetails.approvalStatus === "REJECTED" || expenseDetails.approvalStatus === "APPROVED" || expenseDetails.approvalStatus === "IN_APPROVAL") && 'hidden'}}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id)
                      }}
                    />
                  </li>
                );
              })}
            </ul>
            )}
            {!editMode && (files && files.map((file, index) => (
              <div key={index} style={{display:'flex',alignItems:'center',gap:'10px'}}>
                <Typography variant="subtitle1">{file.name}</Typography>
                <IconButton color="error">
                  <CloseIcon onClick={() => handleRemoveFile(index)} />
                </IconButton>
              </div>
            )))}
            {editMode &&
              (files && files.length > 0 )&& (
                <Typography variant="subtitle1">
                  {`${files.length} files selected`}
                </Typography>
              )
            }
            {editMode ? 
              <>
                {expenseDetails.approvalStatus === 'DRAFT' &&
                  <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{ textTransform: 'none' }}
                    onClick={handleUpdateDraft}
                    disabled={expenseDetails.approvalStatus === "REJECTED" ||
                      expenseDetails.approvalStatus === "APPROVED" ||
                      expenseDetails.approvalStatus === "IN_APPROVAL" ||
                      !selectedProject ||
                      !selectedSubProject ||
                      !expenseDetails.amount ||
                      !expenseDetails.category}
                  >Update as Draft</Button>}
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={handleUpdate}
                  disabled={expenseDetails.approvalStatus === "REJECTED" ||
                    expenseDetails.approvalStatus === "APPROVED" ||
                    expenseDetails.approvalStatus === "IN_APPROVAL" ||
                    !selectedProject ||
                    !selectedSubProject ||
                    !expenseDetails.amount ||
                    !expenseDetails.category}
                >
                  Submit for approval
                </Button>
              </> :
              <>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={handleDraft}
                  disabled={
                    !selectedSubProject ||
                    !expenseDetails.amount ||
                    !expenseDetails.category
                  }
                >
                  Save As Draft
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  sx={{ textTransform: 'none' }}
                  onClick={handleSubmit}
                  disabled={
                    !selectedSubProject ||
                    !expenseDetails.amount ||
                    !expenseDetails.category
                  }
                >
                  Submit for approval
                </Button>
              </>
            }
          </Box>
        </form>
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
  );
};

export default ExpenseReportPage;
