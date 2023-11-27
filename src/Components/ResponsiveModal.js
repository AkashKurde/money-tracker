import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { useDispatch } from "react-redux";
import { LOGOUT } from "../redux/actionTypes";

const ResponsiveModal = ({ open, setOpen }) => {
    const dispatch = useDispatch();

    const handleNo = () => {
        setOpen(false);
    };

    const handleYes = () => {
        setOpen(false);
        dispatch({ type: LOGOUT });
        
    }
    return (
        <div>
            <Dialog open={open}>
                <DialogContent sx={{fontWeight: '600'}}>Are you sure you want to Log-Out?</DialogContent>
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

export default ResponsiveModal;