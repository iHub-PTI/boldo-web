import React, { useContext, useEffect, useState } from 'react';
import { FormControl, FormGroup, FormControlLabel, FormHelperText, Grid, Typography, IconButton } from '@material-ui/core';
import { ReactComponent as TrashIcon } from '../../assets/trash.svg';
import { ReactComponent as Spinner } from '../../assets/spinner.svg';
import SelectCategory from './SelectCategory'
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import BoxSelect from './BoxSelect';
import CheckOrder from './CheckOrder';
import InputText from './InputText';
import { ReactComponent as IconAdd } from '../../assets/add-cross.svg';
import { ReactComponent as IconInfo } from '../../assets/info-icon.svg';
import { CategoriesContext, Orders } from './Provider';
import { StudiesTemplate } from './ModalTemplate/StudiesTemplate';
import { StudiesWithIndication } from './ModalTemplate/types';
import axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import { useToasts } from '../Toast';
import Tooltip from '@material-ui/core/Tooltip';

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
                //marginRight: "0.313rem",
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
        textfieldDisabled: {
            backgroundColor: "#F4F5F7",
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

//Tooltip Theme
const TooltipInfo = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#FFFF',
      color: 'black',
      maxWidth: 220,
      padding: '1rem',
      fontSize: theme.typography.pxToRem(12),
    },
  }))(Tooltip);


const StudyOrder = ({setShowMakeOrder, remoteMode=false, evaluation=''}) => {
    const { addToast, addErrorToast } = useToasts();
    const classes = useStyles()
    const { orders, setOrders, setIndexOrder } = useContext(CategoriesContext)
    const [show, setShow] = useState(false)
    const [encounterId, setEncounterId] = useState('')

    let matchInperson = useRouteMatch<{ id: string }>(`/appointments/:id/inperson`)
    let matchCall = useRouteMatch<{ id: string }>(`/appointments/:id/call`)

    useEffect(() => {
        const load = async () => {
            try {
                const res = remoteMode ? await axios.get(`/profile/doctor/appointments/${matchCall?.params.id}/encounter`) : await axios.get(`/profile/doctor/appointments/${matchInperson?.params.id}/encounter`)
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

    console.log("eva", evaluation)

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

    const validateOrders = (orders: Array<Orders>) => {
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i]
            if (order.category === "") {
                addToast({ type: 'warning', title: 'Notificación', text: 'Alguna(s) Categoría(s) no han sido seleccionada(s).' })
                return false
            } else if (order.diagnosis === "") {
                addToast({ type: 'warning', title: 'Notificación', text: 'La impresión diagnóstica no puede quedar vacía.' })
                return false
            } else if (order.studies_codes.length <= 0) {
                addToast({ type: 'warning', title: 'Notificación', text: 'No se han seleccionado algun(os) estudio(s)' })
                return false
            }
        }
        return true
    }

    const [showError, setShowError] = useState(false)
    const [sendStudyLoading, setSendStudyLoading] = useState(false)

    const sendOrderToServer = async () => {
        if (validateOrders(orders)) {
            orders.forEach(object => {
                object.encounterId = encounterId;
            });

            let ordersCopy = []
            orders.forEach((object, index) => {
                let studiesCodes = []
                object.studies_codes.forEach(studies => {
                    studiesCodes.push({ "display": studies.name, "code": studies.id, "notes": studies.indication })
                })
                ordersCopy.push({
                    "category": object.category, "diagnosis": object.diagnosis,
                    "encounterId": object.encounterId, "notes": object.notes, "urgent": object.urgent,
                    "studiesCodes": studiesCodes
                })
            });
            console.log(ordersCopy)
            try {
                setShowError(false)
                setSendStudyLoading(true)
                const res = await axios.post(`/profile/doctor/serviceRequest`, ordersCopy)
                console.log("server response", res)
                setSendStudyLoading(false)
                //reset Orders
                setOrders([
                    {
                        category: "",
                        urgent: false,
                        diagnosis: "",
                        studies_codes: [] as Array<StudiesWithIndication>,
                        notes: ""
                    }
                ])
                setIndexOrder(0)
                setShowMakeOrder(false)
                addToast({ type: 'success', title: 'Notificación', text: '¡La(s) orden(es) han sido enviadas!' })
            } catch (error) {
                if (error.response.data?.hasOwnProperty('messages')) {
                    addErrorToast(error.response.data?.messages)
                } else {
                    addErrorToast("Ha ocurrido un error al generar el orden, inténalo de nuevo.")
                }
                setSendStudyLoading(false)
                setShowError(true)
            }
        }
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
                                        <TrashIcon title='Eliminar Orden'></TrashIcon>
                                    </IconButton>
                                </Grid>
                                <Grid item container direction='row' spacing={5}>
                                    {remoteMode ?
                                        <div className='flex md:flex-row sm:flex-col px-4 pb-4'>
                                            <SelectCategory variant='outlined' classes={classes} index={index}></SelectCategory>
                                            <FormGroup style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: "1rem" }}>
                                                <div className='flex flex-col'>
                                                    <CheckOrder checked={item.urgent} index={index}></CheckOrder>
                                                    <span className='flex flex-row items-center'>
                                                        Urgente <TooltipInfo title="marque la opción si estos estudios requieren ser realizados cuanto antes">
                                                            <IconInfo style={{ transform: 'scale(.7)' }} />
                                                        </TooltipInfo>
                                                    </span>
                                                </div>
                                            </FormGroup>
                                        </div>
                                         : 
                                         <>
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
                                        </>
                                    }
                                </Grid>
                            </Grid>

                            <Grid container direction='column'>
                                <Grid style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                                    <Typography>Impresión diagnóstica</Typography>
                                    <InputText name="diagnosis" variant='outlined' className={classes.textfieldDisabled} index={index} disabled={true} value={evaluation} />
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
                    <button className="absolute top-16 right-3 focus:outline-none rounded-md bg-primary-600 text-white font-medium h-8 w-auto p-1 flex flex-row justify-center items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => {
                            sendOrderToServer()

                        }}
                     disabled={sendStudyLoading}
                    >
                        {sendStudyLoading ? <Spinner /> : ''}
                        Listo
                    </button>
                </div>
            </div>
            <StudiesTemplate show={show} setShow={setShow} size="xl5" remoteMode={remoteMode}></StudiesTemplate>
        </div>
    )
}

export default StudyOrder;