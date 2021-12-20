import { CardContent, Grid, Typography } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip';
import {

    withStyles,

} from '@material-ui/core';
import React, { useState } from 'react'
import { ReactComponent as Check } from '../assets/check.svg'
import { ReactComponent as Close } from '../assets/close.svg'
import axios from 'axios';
import { useToasts } from './Toast';

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
    const { addErrorToast } = useToasts()
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

    const handleChange = async () => {
        if(commentText === ''){
            addErrorToast('Agregue un comentario primero, antes de enviar');
            return 
        }
        setIsLoading(true);
        try {
            const payload = {
                "idEncounter": encounterId,
                "text": commentText
            }

            const res = await axios.post(`/profile/doctor/encounters/${encounterId}/privateComments`, payload)
            console.log('respuesa', res.data)
            setIsLoading(false);
            setCommentText('')
        } catch (err) {
            console.log(err)
            addErrorToast(err)
            setIsLoading(false);

        }
    }
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
                </div> : <> <Grid item>
                    <button style={{ outline: 'none' }} >
                        <Close  onClick={() => setCommentText('')}/>
                    </button>

                </Grid>
                    <Grid item>
                        <button style={{ outline: 'none' }} >
                            <Check onClick={() => handleChange()} />
                        </button>

                    </Grid></>}

            </Grid>

        </CardContent>
    )
}
