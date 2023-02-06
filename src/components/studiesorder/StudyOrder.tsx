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
import * as Sentry from '@sentry/react'

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
        textfieldError: {
            backgroundColor: "#FFFFFF",
            width: '100%',
            border: '1px solid red',
            borderRadius: '0.3rem',
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '1px solid',
                borderRadius: '0.3rem'
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


const StudyOrder = ({ setShowMakeOrder, remoteMode = false }) => {
    const { addToast } = useToasts();
    const classes = useStyles()
    const { orders, setOrders, setIndexOrder } = useContext(CategoriesContext)
    const [show, setShow] = useState(false)
    const [encounterId, setEncounterId] = useState('')
    // error types when sending -> category + orderId | diagnosis + orderId | studies + orderId
    const [errorType, setErrorType] = useState('')

    let matchInperson = useRouteMatch<{ id: string }>(`/appointments/:id/inperson`)
    let matchCall = useRouteMatch<{ id: string }>(`/appointments/:id/call`)

    const scrollToBy = (id: string) => {
        let scrollDiv = document.getElementById(id).offsetTop - 150;
        document.getElementById("study_orders").scrollTo({ top: scrollDiv, behavior: 'smooth' })
    }

    useEffect(() => {
        const load = async () => {
            const id = remoteMode ? matchCall?.params.id : matchInperson?.params.id
            const url = `/profile/doctor/appointments/${id}/encounter`
            try {
                const res = await axios.get(url)
                //console.log(res.data)
                setEncounterId(res.data.encounter.id)

            } catch (err) {
                //console.log(err)
                Sentry.setTags({
                    'endpoint': url,
                    'method': 'GET',
                    'appointment_id': id
                })
                if (err.response) {
                    // The response was made and the server responded with a 
                    // status code that is outside the 2xx range.
                    Sentry.setTag('data', err.response.data)
                    Sentry.setTag('headers', err.response.headers)
                    Sentry.setTag('status_code', err.response.status)
                } else if (err.request) {
                    // The request was made but no response was received
                    Sentry.setTag('request', err.request)
                } else {
                    // Something happened while preparing the request that threw an Error
                    Sentry.setTag('message', err.message)
                }
                Sentry.captureMessage("Could not get the encounter in the creation of study order")
                Sentry.captureException(err)
                addToast({
                    type: 'error',
                    title: 'Ha ocurrido un error.',
                    text: 'No se pudieron cargar algunos detalles. ¡Inténtelo nuevamente más tarde!'
                })
            } finally {
                // setInitialLoad(false)
            }
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const addCategory = () => {
        setOrders([...orders, {
            id: orders[orders.length - 1].id + 1,
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
        //console.table(orders)
    }

    const validateOrders = (orders: Array<Orders>) => {
        setErrorType('')
        for (let i = 0; i < orders.length; i++) {
            let order = orders[i]
            if (order.category === "") {
                addToast({ type: 'warning', title: 'Notificación', text: 'Seleccione una categoría.' })
                scrollToBy(order.id.toString())
                setErrorType('category' + order.id)
                return false
            } else if (order.diagnosis === "") {
                addToast({ type: 'warning', title: 'Notificación', text: 'La impresión diagnóstica no puede quedar vacía.' })
                scrollToBy(order.id.toString())
                setErrorType('diagnosis' + order.id)
                return false
            } else if (order.studies_codes.length <= 0) {
                addToast({ type: 'warning', title: 'Notificación', text: 'No se han seleccionado los estudios.' })
                scrollToBy(order.id.toString())
                setErrorType('studies' + order.id)
                return false
            }
        }
        return true
    }

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
            // console.log(ordersCopy)
            const url = `/profile/doctor/serviceRequest`
            try {
                setSendStudyLoading(true)
                let total = ordersCopy.length
                const res = await axios.post(url, ordersCopy)
                console.log("server response", res)
                setSendStudyLoading(false)
                //reset Orders
                setOrders([
                    {
                        id: 1,
                        category: "",
                        urgent: false,
                        diagnosis: "",
                        studies_codes: [] as Array<StudiesWithIndication>,
                        notes: ""
                    }
                ])
                setIndexOrder(0)
                setShowMakeOrder(false)
                addToast({ type: 'success', title: 'Notificación', text: total > 1 ? 'Las órdenes han sido enviadas.': 'La orden ha sido enviada.' })
            } catch (err) {
                Sentry.setTag('endpoint', url)
                Sentry.setTag('method', 'POST')
                if (err.response) {
                    // The response was made and the server responded with a 
                    // status code that is outside the 2xx range.
                    Sentry.setTag('data', err.response.data)
                    Sentry.setTag('headers', err.response.headers)
                    Sentry.setTag('status_code', err.response.status)
                } else if (err.request) {
                    // The request was made but no response was received
                    Sentry.setTag('request', err.request)
                } else {
                    // Something happened while preparing the request that threw an Error
                    Sentry.setTag('message', err.message)
                }
                Sentry.captureMessage("Could not generate a new study order")
                Sentry.captureException(err)
                addToast({
                    type: 'error',
                    title: 'Ha ocurrido un error.',
                    text: 'No se pudo generar la orden de estudios. ¡Inténtalo nuevamente más tarde!'
                })
                setSendStudyLoading(false)
            }
        }
    }

    return (
        <div className="w-full">
            {
                orders.map((item, index) => {
                    return <div id={item.id.toString()} className="pt-3 px-5 pb-7 ml-1 mr-5 mb-5 bg-gray-50 rounded-xl">
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
                                            <SelectCategory variant='outlined' classes={classes} index={index} error={errorType === 'category' + item.id} />
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
                                                <SelectCategory variant='outlined' classes={classes} index={index} error={errorType === 'category' + item.id} />
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
                                    <InputText name="diagnosis" variant='outlined' className={errorType === 'diagnosis' + item.id ? classes.textfieldError : classes.textfield} index={index} />
                                </Grid>
                                <Grid style={{ marginBottom: '1rem' }}>
                                    <Typography>Estudios a realizar</Typography>
                                    <BoxSelect index={index} show={show} setShow={setShow} style={{
                                        border: errorType === 'studies' + item.id ?
                                            '1px solid red' : '',
                                        minHeight: '3rem'
                                    }}></BoxSelect>
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