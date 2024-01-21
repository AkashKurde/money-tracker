import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import axios from "axios";
import { baseURL } from "../utils/services";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CloseSubProject = ({closeModal, setCloseModal, subProjectId,setOpenToast, setMsg ,setSeverity}) => {
    const navigate=useNavigate();
    const loginData = useSelector(state => state.auth.user);
    const handleNo = () => {
        setCloseModal(false);
    };

    const handleYes = () => {
        setCloseModal(false);
        axios({
            method: 'put',
            url: `${baseURL}/api/project-mgmt`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
            data: {
                subProjectId:subProjectId,
                close:true
            }
        })
            .then((res) => {
                console.log("Response:", res.data);
                setOpenToast(true);
                setSeverity('success')
                setMsg('Sub-Project Updated Successfully')
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
    return (
        <div>
            <Dialog open={closeModal}>
                <DialogContent >
                    <Typography sx={{fontWeight: '600'}}>
                    Are you sure you want to Close?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNo} color="primary">
                        No
                    </Button>
                    <Button onClick={handleYes} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CloseSubProject;