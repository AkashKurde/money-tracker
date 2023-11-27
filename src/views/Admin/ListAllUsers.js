import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Alert, Avatar, Container, IconButton, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Pagination, Snackbar } from '@mui/material'
import { baseURL } from '../../utils/services';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CallIcon from '@mui/icons-material/Call';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModel from '../../Components/DeleteModel';

const ListAllUsers = () => {
    const loginData = useSelector(state => state.auth.user);
    const [userList,setUserList]=useState([]);
    const [pageCount,setPageCount]=useState(0);
    const [currentPage,setCurrentPage]=useState(0);
    const [open,setOpen]=useState(false);
    const [openToast, setOpenToast] = useState(false);
    const [msg, setMsg] = useState('');
    const [severity, setSeverity] = useState('success');
    const [deleteId,setDeleteId]=useState(null);
    const [DeleteFlag,setDeleteFlag]=useState(false)
    //get all users
    useEffect(() => {
        axios({
            method: 'post',
            url: `${baseURL}/api/authentication/users/${currentPage}`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response: users", res.data);
                setUserList(res.data.content);
                setPageCount(res.data.totalPages)
            })
            .catch((err) => {
                console.log("Error:", err);
            });
    }, [DeleteFlag]);

    const handlePageChange = (event, page) => {
        setCurrentPage(page - 1);
      }
    
      const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenToast(false);
      };
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
            <Header name={'Users'} />
            <List sx={{ width: '100%', marginTop: '20px' }}>
                {userList.map((user) => {
                    const initials = user.name
                        .split(' ')
                        .map((part) => part.charAt(0))
                        .join('')
                        .toUpperCase();

                    return (
                        <ListItem key={user.id}>
                            <ListItemAvatar>
                                <Avatar>{initials}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {user.name}
                                    </div>
                                }
                                secondary={user.phone}
                            />
                            <ListItemIcon sx={{gap:'14px'}}>
                                <IconButton
                                    edge="end"
                                    aria-label="call"
                                    component="a"
                                    href={`tel:${user.phone}`}
                                >
                                    <CallIcon sx={{color:'green'}} />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    onClick={()=>{
                                        setOpen(true);
                                        setDeleteId(user.id)
                                    }}
                                >
                                    <DeleteIcon sx={{color:'red'}} />
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>
                    );
                })}
            </List>

            <Pagination
                color="primary"
                count={pageCount}
                page={currentPage + 1}
                sx={{ mt: 2 }}
                onChange={handlePageChange}
            />
            <DeleteModel open={open} setOpen={setOpen} deleteId={deleteId} setDeleteFlag={setDeleteFlag} DeleteFlag={DeleteFlag} setOpenToast={setOpenToast} setMsg={setMsg} setSeverity={setSeverity} />
            <Snackbar sx={{ top: '75px' }} open={openToast} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert variant='filled' onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {msg}
                </Alert>
            </Snackbar>
        </Container>

    )
}

export default ListAllUsers