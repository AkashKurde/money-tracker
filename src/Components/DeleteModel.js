import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import axios from "axios";
import { baseURL } from "../utils/services";
import { useSelector } from "react-redux";

const DeleteModel = ({ open, setOpen, deleteId, setDeleteFlag, DeleteFlag,setOpenToast, setMsg ,setSeverity}) => {
    const loginData = useSelector(state => state.auth.user);
    const handleNo = () => {
        setOpen(false);
    };

    const handleYes = () => {
        setOpen(false);
        axios({
            method: 'delete',
            url: `${baseURL}/api/authentication/${deleteId}`,
            headers: {
                'Authorization': `Bearer ${loginData.jwt}`,
            },
        })
            .then((res) => {
                console.log("Response:", res.data);
                setDeleteFlag(!DeleteFlag);
                setOpenToast(true);
                setMsg("Delete SuccessFully");
                setSeverity('success')
            })
            .catch((err) => {
                console.log("Error:", err);
                setOpenToast(true);
                setMsg("Error While Delete ");
                setSeverity('error')
            });
    }
    return (
        <div>
            <Dialog open={open}>
                <DialogContent sx={{fontWeight: '600'}}>Are you sure you want to Delete?</DialogContent>
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

export default DeleteModel;