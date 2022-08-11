import React, { useState, ChangeEvent } from 'react';

import { FormControl, FormGroup, FormControlLabel, FormHelperText, Grid, Checkbox, Typography, TextField } from '@material-ui/core';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import SelectCategory from './SelectCategory';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Widgets } from '@material-ui/icons';

//HoverSelect theme and Study Order styles
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        menuItem: {
            '&:active': {
                backgroundColor: "#EDFAFA"
            },
            '&:focus': {
                backgroundColor: "#EDFAFA"
            },
            '&:hover': {
                backgroundColor: "#EDFAFA"
            },
            '&:selected': {
                backgroundColor: "black"
            }
        },
        select: {
            paddingTop: '0.2rem',
            paddingLeft: '0.3rem',
            backgroundColor:'#FFFFFF',
            borderRadius: '0.5rem',
            "&&&:before": {
                borderBottom: "none"
            },
            "&&:after": {
                borderBottom: "none"
            },
            '& .MuiSelect-select:focus': {
                backgroundColor: "transparent"
            },
            "& .MuiSvgIcon-root": {
                color: "#13A5A9",
                marginRight: "0.313rem",
                cursor: "default"
            },
            '& .MuiListItem-root.Mui-selected': {
                backgroundColor: "#EDFAFA"
            },
            '& .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
                backgroundColor: "#EDFAFA"
            },
        },
        form: {
            width: '100%',
        },
        textfield: {
            backgroundColor: "#FFFFFF",
            width: '100%',
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: "#808080",
            }
        }
    }),
);

const StudyOrder = () => {
    const classes = useStyles()
    const [checkOrder, setCheckOrder] = useState(false)

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckOrder(event.target.checked)
        console.log(checkOrder)
    }

    return (
        <div className="m-10 p-5 pb-10 bg-gray-50 rounded-xl">
            <FormControl className={classes.form}>
                <Grid container direction="row" justifyContent="flex-end">
                    <button>
                        <TrashIcon />
                    </button>
                </Grid>
                <Grid container direction='column'>
                    <Grid container direction='row' spacing={5}>
                        <Grid item xs={3}>
                            <SelectCategory classes={classes}></SelectCategory>
                        </Grid>
                        <Grid item xs={9}>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={checkOrder} onChange={handleCheck} name="orden" />}
                                    label="Orden Urgente"
                                />
                            </FormGroup>
                            <FormHelperText>marque la opción si estos estudios requieren ser realizadas cuanto antes</FormHelperText>
                        </Grid>
                    </Grid>
                    <Grid style={{marginBottom:'1rem'}}>
                        <Typography>Estudios a realizar</Typography>
                        <TextField variant='outlined' className={classes.textfield}></TextField>
                    </Grid>
                    <Grid >
                        <Typography>Observaciones</Typography>
                        <TextField variant='outlined' className={classes.textfield}></TextField>
                    </Grid>
                </Grid>
            </FormControl>
        </div>
    )
}

export default StudyOrder;