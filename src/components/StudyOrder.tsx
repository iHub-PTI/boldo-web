import React, { useState, ChangeEvent } from 'react';

import { FormControl, FormGroup, FormControlLabel, FormHelperText, Grid, Checkbox, Typography, TextField, IconButton} from '@material-ui/core';
import { ReactComponent as TrashIcon } from '../assets/trash.svg';
import SelectCategory from './SelectCategory';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BoxSelect from './BoxSelect';

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
        },
        buttonClass: {
            '.MuiIconButton-root MuiButtonBase-root': {
                padding: '0'
            }
        }
    }),
);


const StudyOrder = () => {
    const classes = useStyles()
    const [checkOrder, setCheckOrder] = useState(false)
    const options = ['Glucosa', ' Hemograma de Constraste', 'Sangre']

    const handleCheck = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckOrder(event.target.checked)
        console.log(checkOrder)
    }

    return (
        <div className="pt-3 px-5 pb-7 m-5 bg-gray-50 rounded-xl">
            <FormControl className={classes.form}>
                <Grid container>
                    <Grid item container direction="row" justifyContent="flex-end" >
                        <IconButton aria-label="Eliminar" style={{padding: '3px', margin: '0', outline: 'none'}}>
                            <TrashIcon></TrashIcon>
                        </IconButton>
                    </Grid>
                    <Grid item container direction='row' spacing={5}> 
                            <Grid item xs={4}>
                                <SelectCategory variant='outlined' classes={classes}></SelectCategory>
                            </Grid>
                            <Grid item xs={8}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Checkbox checked={checkOrder} onChange={handleCheck} name="orden" />}
                                        label="Orden Urgente"
                                    />
                                </FormGroup>
                                <FormHelperText>marque la opción si estos estudios requieren ser realizadas cuanto antes</FormHelperText>
                            </Grid>
                    </Grid>
                </Grid>
                
                <Grid container direction='column'>
                    <Grid style={{ marginBottom: '1rem', marginTop: '1rem'}}>
                        <Typography>Impresión diagnóstica</Typography>
                        <TextField variant='outlined' className={classes.textfield}></TextField>
                    </Grid>
                    <Grid style={{ marginBottom: '1rem' }}>
                        <Typography>Estudios a realizar</Typography>
                        <BoxSelect options={options}></BoxSelect>
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