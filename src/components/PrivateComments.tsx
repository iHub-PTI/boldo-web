import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip';
import {
    withStyles,
} from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom'

import React, { useState, useEffect } from 'react'
import { ReactComponent as Check } from '../assets/check.svg'
import { ReactComponent as Close } from '../assets/close.svg'
import axios from 'axios';
import { useToasts } from './Toast';
import moment from 'moment';

export default function PrivateComments({
    encounterId,
    setDataCallback,
    appointment
}: {
    encounterId: any,
    setDataCallback: any,
    appointment: any

}) {
    const [commentText, setCommentText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [privateCommentsRecord, setPrivateCommentsRecords] = useState([])
    const [showHover, setShowHover] = useState('')
    const [selectedCommnent, setSelectedCommnent] = useState()
    const { addErrorToast } = useToasts()
    let match = useRouteMatch<{ id: string }>('/appointments/:id/call')
    const id = match?.params.id
    const [isAppointmentDisabled, setAppointmentDisabled] = useState(true)
    const toolTipData = () => {
        return (<>
            <Grid container>
            </Grid>
            <Grid  >
                <Typography style={{ color: '#27BEC2', fontSize: '18px' }} >Comentarios Privados</Typography>
                <Typography variant="subtitle1" color="textPrimary" >Esta sección está destinada a almacenar información que no desee compartir con su paciente de forma inmediata.
                    A diferencia de las demás notas, solamente usted puede ver esta información. </Typography>
            </Grid>
        </>)
    }
    const CustomToolTip = withStyles((theme) => ({
        tooltip: {
            backgroundColor: '#EDF2F7',
            color: 'black',
            maxWidth: 220,
            fontSize: theme.typography.pxToRem(12),

        },
    }))(Tooltip);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`/profile/doctor/appointments/${id}/encounter`);
                const { status = '' } = res.data.encounter
                if (status === 'finished' || status === 'locked' || status === 'cancelled') {
                    setAppointmentDisabled(true);
                } else {
                    setAppointmentDisabled(false);
                }

            } catch (err) {
                console.log(err)
                //@ts-ignore
                addErrorToast(err)
            }
        }

        load()
        // eslint-disable-next-line
    }, [])

    const handleChange = async () => {
        if (commentText === '') {
            addErrorToast('Agregue un comentario primero, antes de enviar');
            return
        }
        setIsLoading(true);
        try {
            const payload = {
                "idEncounter": encounterId,
                "text": commentText
            }

            if (selectedCommnent === undefined) {
                // send new comment
                await axios.post(`/profile/doctor/encounters/${encounterId}/privateComments`, payload)
                setIsLoading(false);
                setCommentText('')
                getPrivateCommentsRecords()

            } else {
                // update comment
                //@ts-ignore
                await axios.put(`/profile/doctor/encounters/${selectedCommnent.idEncounter}/privateComments/${selectedCommnent.id}`, payload)
                //console.log('respuesta', res.data)
                setIsLoading(false);
                setCommentText('')
                setSelectedCommnent(undefined)
                getPrivateCommentsRecords()
            }
        } catch (err) {
            console.log(err)
             //@ts-ignore
            addErrorToast(err)
            setIsLoading(false);

        }
    }
    const handleDelete = async (item: any) => {
        setIsLoading(true);
        try {
            // delete comment
            //@ts-ignore
           await axios.delete(`/profile/doctor/encounters/${item.idEncounter}/privateComments/${item.id}`);
            setIsLoading(false);
            setCommentText('')
            setSelectedCommnent(undefined)
            getPrivateCommentsRecords()

        } catch (err) {
            console.log(err)
             //@ts-ignore
            addErrorToast(err)
            setIsLoading(false);

        }
    }

    const getPrivateCommentsRecords = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/profile/doctor/relatedEncounters/${encounterId}/privateComments`)
            setIsLoading(false);
            let tempArray = res.data.encounter.items;
            tempArray.reverse();
            setPrivateCommentsRecords(tempArray)
        } catch (err) {
            console.log(err)
             //@ts-ignore
            addErrorToast(err)
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getPrivateCommentsRecords();
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (commentText === undefined || commentText === '') {
            setSelectedCommnent(undefined)
        }
    }, [commentText])

    useEffect(() => {
        if (selectedCommnent) {
            //@ts-ignore
            setCommentText(selectedCommnent.text)
        }
    }, [selectedCommnent])

    return (
        <CardContent style={{ width: '300px' }} >
            <div className="grid grid-rows-1 grid-flow-col">
                <div className="row-span-3 ">
                    <button
                        onClick={() => setDataCallback(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>
                <div className="col-span-2 ">  <Typography noWrap variant="h6" color="textPrimary">
                    Comentarios Privados
                </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        Solo usted puede ver la información almacenada en esta sección.
                    </Typography>
                    <CustomToolTip
                        title={toolTipData()}
                    >
                        <p style={{ color: '#27BEC2' }} className="underline">saber más</p>
                    </CustomToolTip>

                </div>
            </div>

            <Grid style={{ marginTop: '20px' }}>
                <Typography variant="subtitle2" color="textSecondary">
                    Paciente:
                </Typography>
                <Typography noWrap variant="subtitle2" color="textPrimary">
                    {appointment.patient.givenName} {appointment.patient.familyName}
                </Typography>
            </Grid>

            <div className='col-span-6 mb-6 sm:col-span-3 mt-5'>
                <Typography noWrap variant="subtitle2" color="textPrimary">
                    Agregar nuevo
                </Typography>
                <textarea
                    id='Diagnostico'
                    disabled={isAppointmentDisabled}
                    required
                    rows={3}
                    className='block w-full mt-1 transition duration-150 ease-in-out form-textarea sm:text-sm sm:leading-5'
                    placeholder=''
                    value={commentText}
                    style={{ fontSize: '14px', resize: 'none' }}
                    onChange={e => setCommentText(e.target.value)}
                />
            </div>

            <Grid justifyContent='flex-end' spacing={2} container>
                {isLoading === true ? <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
                    <svg
                        className='w-6 h-6 text-secondary-500 animate-spin'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                    >
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='2'></circle>
                        <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                        ></path>
                    </svg>
                </div> :
                isAppointmentDisabled === false &&
                    <> <Grid item>
                        <button style={{ outline: 'none' }} >
                            <Close onClick={() => {
                                setCommentText('')
                                setSelectedCommnent(undefined)
                            }} />
                        </button>

                    </Grid>
                        <Grid item>
                            <button style={{ outline: 'none' }} >
                                <Check onClick={() => handleChange()} />
                            </button>

                        </Grid>
                    </>}

            </Grid>

            {
                privateCommentsRecord.length > 0 && isLoading === false &&
                <div className='col-span-6 mb-6 sm:col-span-3 mt-5'>
                    <Typography variant="subtitle2" color="textPrimary">
                        Anteriores
                    </Typography>
                    <ul>
                        {privateCommentsRecord.map(function (item: any) {
                            const date = moment(item.dateTime).format('DD/MM/YYYY')

                            return (
                                <Card key={item.dateTime} elevation={0} style={{
                                    marginTop: '10px', backgroundColor: '#fbfdfe', borderColor: '#e2e8f0',
                                    borderWidth: '1px',
                                    borderRadius: '10px'
                                }}
                                    onMouseEnter={() => setShowHover(item.dateTime)}
                                    onMouseLeave={() => setShowHover('')}
                                >
                                    <CardContent>

                                        <Grid style={{ height: '20px' }} container  >

                                            <Grid item >
                                                <Typography variant="body2" color="textSecondary">
                                                    {date}
                                                </Typography>
                                            </Grid>
                                            <Grid style={{
                                                marginRight: '0',
                                                marginLeft: 'auto',
                                                marginBottom: 'auto',
                                            }} item >
                                                {showHover === item.dateTime && isAppointmentDisabled === false && <button onClick={() => setSelectedCommnent(item)} style={{ outline: 'none' }}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg></button>}
                                            </Grid>
                                            <Grid item >
                                                {showHover === item.dateTime  && isAppointmentDisabled === false && <button onClick={() => handleDelete(item)} style={{ outline: 'none' }}><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg></button>}
                                            </Grid>
                                        </Grid>

                                        <Typography variant="subtitle1" color="textPrimary">
                                            {item.text}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </ul>
                </div>


            }


        </CardContent>
    )
}
