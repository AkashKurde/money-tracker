import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle
} from "@mui/material";
import { useDispatch } from "react-redux";
import { ADMIN_PRJ_ID, APPROVER_DATA, LOGOUT, REPORT_DATA, STATUS, USER_PROFIT_DATA } from "../redux/actionTypes";

const ResponsiveModal = ({ open, setOpen }) => {
    const dispatch = useDispatch();

    const handleNo = () => {
        setOpen(false);
    };

    const handleYes = () => {
        setOpen(false);
        dispatch({ type: LOGOUT });
        dispatch({type: USER_PROFIT_DATA ,payload: null})
        dispatch({type: REPORT_DATA,payload: null})
        dispatch({type: ADMIN_PRJ_ID, payload: null })
        dispatch({ type: STATUS, payload: null })
        dispatch({ type: APPROVER_DATA, payload: null })
        
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