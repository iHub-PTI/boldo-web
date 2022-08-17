import React, { useState, ChangeEvent, useEffect } from 'react';

import { FormControl, FormGroup, FormControlLabel, FormHelperText, Grid, Typography, IconButton } from '@material-ui/core';
import { ReactComponent as TrashIcon } from '../../assets/trash.svg';
import SelectCategory from '../SelectCategory';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BoxSelect from './BoxSelect';
import CheckOrder from './CheckOrder';
import InputText from './InputText';
import { ReactComponent as IconAdd } from '../../assets/add-cross.svg';

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

    const [orders, setOrders] = useState([
        {
            category: "",
            rush_order: false,
            diagnostic_impression: "",
            studies: [{ id: 1, name: 'Glucosa' }, { id: 2, name: ' Hemograma de Constraste' }, { id: 3, name: 'Sangre' }],
            observation: ""
        }
    ]);

    const addCategory = () => {
        setOrders([...orders, {
            category: "",
            rush_order: false,
            diagnostic_impression: "",
            studies: [{ id: 1, name: 'Glucosa' }, { id: 2, name: ' Hemograma de Constraste' }, { id: 3, name: 'Sangre' }],
            observation: ""
        }])
    }

    const deleteCategory = (key) => {
        if (key > 0){
            let update = [...orders]
            update.splice(key,1)
            setOrders(update)
        }
    }

    return (
        <>
            {
                orders.map((item, index) => {
                    return <div className="pt-3 px-5 pb-7 m-5 bg-gray-50 rounded-xl">
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid item container direction="row" justifyContent="flex-end" >
                                    <IconButton aria-label="Eliminar" style={{ padding: '3px', margin: '0', outline: 'none' }} onClick={()=>deleteCategory(index)}>
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
                                                control={<CheckOrder checked={false}></CheckOrder>}
                                                label="Orden Urgente"
                                            />
                                        </FormGroup>
                                        <FormHelperText>marque la opción si estos estudios requieren ser realizadas cuanto antes</FormHelperText>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid container direction='column'>
                                <Grid style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                                    <Typography>Impresión diagnóstica</Typography>
                                    <InputText variant='outlined' className={classes.textfield} />
                                </Grid>
                                <Grid style={{ marginBottom: '1rem' }}>
                                    <Typography>Estudios a realizar</Typography>
                                    <BoxSelect options={item.studies}></BoxSelect>
                                </Grid>
                                <Grid >
                                    <Typography>Observaciones</Typography>
                                    <InputText variant='outlined' className={classes.textfield} multiline />
                                </Grid>
                            </Grid>
                        </FormControl>
                    </div>
                })
            }
            <div className="m-1 p-1 flex justify-end">
                <button className="btn focus:outline-none border-primary-600 border-2 mx-3 px-3 my-1 py-1 rounded-lg text-primary-600 font-semibold flex flex-row "
                    onClick={() => addCategory()}
                >Agregar
                    <span className="pt-2 mx-2"><IconAdd></IconAdd></span>
                </button>
            </div>
        </>

    )
}

export default StudyOrder;