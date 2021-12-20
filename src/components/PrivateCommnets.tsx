import { CardContent, Grid, Typography } from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip';
import {

    withStyles,

} from '@material-ui/core';
import React, { useState } from 'react'
import { ReactComponent as Check } from '../assets/check.svg'
import { ReactComponent as Close } from '../assets/close.svg'

export default function PrivateComments({
    showPrivateComments,
    setDataCallback,
    appointment
}: {
    showPrivateComments: any,
    setDataCallback: any,
    appointment: any

}) {
    const [commentText, setCommnetText] = useState('')
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
                // onChange={e => setDiagnose(e.target.value)}
                // value={diagnose}
                />
            </div>

            <Grid justifyContent='flex-end' spacing={2} container>
                <Grid item>
                    <button style={{outline: 'none' }} >
                        <Close />
                    </button>

                </Grid>
                <Grid item>
                    <button style={{outline: 'none' }} >
                        <Check />
                    </button>

                </Grid>
            </Grid>

        </CardContent>
    )
}
