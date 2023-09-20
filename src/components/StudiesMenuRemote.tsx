import {
  Avatar,
  Grid,
  Typography
} from '@material-ui/core';
import React from 'react';
import StudyOrder from "./studiesorder/StudyOrder";



export function StudiesMenuRemote({ appointment }) {
    return (
        <div className='flex flex-col bg-white shadow-xl relative overflow-hidden' style={{ height: "100%" }}>
            <Grid>
                <Grid container style={{ backgroundColor: '#27BEC2', color: 'white', alignItems: 'center', minHeight: '70px', paddingLeft:'2rem'}}> 
                    <Typography variant='h6'>Nueva orden de estudios</Typography>
                </Grid>
                <Grid className='w-full px-4 mt-2 h-full'>
                    <div className="flex flex-row flex-no-wrap w-full truncate" title={`${appointment?.patient?.givenName.split(' ')[0]} ${appointment.patient.familyName.split(' ')[0]} CI: ${appointment.patient.identifier}`}>
                        <Avatar
                            style={{
                                width: `60px`,
                                height: `60px`,
                                borderRadius: '100px',
                            }}
                            variant='square'
                            src={appointment && appointment.patient.photoUrl}
                        >
                            {/* <PatientIcon /> */}
                        </Avatar>
                        <div className='flex flex-col flex-no-wrap p-3 '>
                            <div className="flex flex-row flex-no-wrap w-full truncate">
                                {appointment && appointment.patient.givenName.split(' ')[0]}  {appointment && appointment.patient.familyName.split(' ')[0]}
                            </div>
                            <Typography variant='body2' color='textSecondary'>
                                {appointment.patient?.identifier == null || appointment.patient?.identifier?.includes('-')
                                    ? 'Paciente sin cédula'
                                    : 'CI ' + appointment.patient?.identifier}
                            </Typography>
                        </div>
                    </div>
                      <div id="study_orders" className="overflow-y-auto scrollbar" style={{ height: 'calc( 100vh - 220px)' }}>
                        {/* {console.log("encounter => ", encounter)} */}
                        <StudyOrder appointment={appointment} remoteMode={true} />
                      </div>
                </Grid>
            </Grid>
        </div>
    )
}