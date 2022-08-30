import React, { useContext, useEffect, useState } from 'react';

import { FormControl, FormGroup, FormControlLabel, FormHelperText, Grid, Typography, IconButton } from '@material-ui/core';
import { ReactComponent as TrashIcon } from '../../assets/trash.svg';
import SelectCategory from './SelectCategory'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BoxSelect from './BoxSelect';
import CheckOrder from './CheckOrder';
import InputText from './InputText';
import { ReactComponent as IconAdd } from '../../assets/add-cross.svg';
import { CategoriesContext, Orders } from './Provider';
import { StudiesTemplate } from './ModalTemplate/StudiesTemplate';
import { StudiesWithIndication } from './ModalTemplate/types';
import axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import { useToasts } from '../Toast';

// import { useToasts } from './Toast';
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
    const { addToast, addErrorToast } = useToasts();
    const classes = useStyles()
    const { orders, setOrders } = useContext(CategoriesContext)
    const [show, setShow] = useState(false)
    const [encounterId, setEncounterId] = useState('')

    let match = useRouteMatch<{ id: string }>(`/appointments/:id/inperson`)
    const id = match?.params.id


    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`)
                console.log(res.data)
                setEncounterId(res.data.encounter.id)

            } catch (err) {
                console.log(err)
            } finally {
                // setInitialLoad(false)
            }
        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addCategory = () => {
        setOrders([...orders, {
            category: "",
            urgent: false,
            diagnosis: "",
            studies_codes: [] as Array<StudiesWithIndication>,
            notes: ""
        }])
    }

    const deleteCategory = (key) => {
        if (orders.length > 1) {
            let update = [...orders]
            update.splice(key, 1)
            setOrders(update)
        }
        console.table(orders)
    }

    /* const validateOrders = (orders: Array<Orders>) => {
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i]
            if(order.category === "") {
                addToast({ type: 'warning', title: 'Notificación', text: 'Alguna(s) Categoría(s) no han sido seleccionada(s).' }) 
                break 
            }else if(order.diagnosis === "") {
                addToast({ type: 'warning', title: 'Notificación', text: 'La impresión diagnóstica no puede quedar vacía.' })
                break
            }else if(order.studies_codes.length <= 0){
                addToast({ type: 'warning', title: 'Notificación', text: 'No se han seleccionado algun(os) estudio(s)' })
                break
            }
        }
    } */

    const [showError, setShowError] = useState(false)
    const [sendStudyLoading, setSendStudyLoading] = useState(false)

    const sendOrderToServer = async () => {
        //validateOrders(orders)
        // const payload = {
        //     "idEncounter": 'encounterId',
        //     "text": 'commentText'
        // }

        orders.forEach(object => {
            object.encounterId = encounterId;
            // object.studies_codes = object.s
          });

          console.log('order before send',orders)
        // try {
        //     setShowError(false)
        //     setSendStudyLoading(true)
        //     const res = await axios.post(`/profile/doctor/serviceResquest`, orders)
        //     console.log("server response", res.data)
        //     setSendStudyLoading(false)
        // } catch (err) {
        //     console.log(err)
        //     setShowError(true)
        // }
    }

    return (
        <div className="w-full">
            {
                orders.map((item, index) => {
                    return <div className="pt-3 px-5 pb-7 ml-1 mr-5 mb-5 bg-gray-50 rounded-xl">
                        <FormControl className={classes.form}>
                            <Grid container>
                                <Grid item container direction="row" justifyContent="flex-end" >
                                    <IconButton aria-label="Eliminar" style={{ padding: '3px', margin: '0', outline: 'none' }} onClick={() => deleteCategory(index)}>
                                        <TrashIcon></TrashIcon>
                                    </IconButton>
                                </Grid>
                                <Grid item container direction='row' spacing={5}>
                                    <Grid item xs={5}>
                                        <SelectCategory variant='outlined' classes={classes} index={index}></SelectCategory>
                                    </Grid>
                                    <Grid item xs={7}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<CheckOrder checked={item.urgent} index={index}></CheckOrder>}
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
                                    <InputText name="diagnosis" variant='outlined' className={classes.textfield} index={index} />
                                </Grid>
                                <Grid style={{ marginBottom: '1rem' }}>
                                    <Typography>Estudios a realizar</Typography>
                                    <BoxSelect index={index} show={show} setShow={setShow}></BoxSelect>
                                </Grid>
                                <Grid >
                                    <Typography>Observaciones</Typography>
                                    <InputText name="observation" variant='outlined' className={classes.textfield} multiline index={index} />
                                </Grid>
                            </Grid>
                        </FormControl>
                    </div>
                })
            }
            <div className="m-1 p-1 flex justify-end justify-items-end">
                <div className='flex flex-col relative'>
                    <button className="btn focus:outline-none border-primary-600 border-2 mx-3 px-3 my-1 py-1 rounded-lg text-primary-600 font-semibold flex flex-row "
                        onClick={() => addCategory()}
                    >Agregar
                        <span className="pt-2 mx-2"><IconAdd></IconAdd></span>
                    </button>
                    <button className="absolute top-16 right-3 focus:outline-none rounded-md bg-primary-600 text-white font-medium h-8 w-12"
                        onClick={() => {
                            sendOrderToServer()

                        }}
                    >
                        Listo
                    </button>
                </div>
            </div>
            <StudiesTemplate show={show} setShow={setShow} size="xl5" ></StudiesTemplate>
        </div>
    )
}

export default StudyOrder;