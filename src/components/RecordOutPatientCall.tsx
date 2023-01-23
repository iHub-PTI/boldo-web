import React from 'react'
import { Disclosure } from '@headlessui/react'
import { toUpperLowerCase } from '../util/helpers';
import ArrowDown from './icons/ArrowDown';
import differenceInYears from 'date-fns/differenceInYears';
type AppointmentWithPatient = Boldo.Appointment & { patient: iHub.Patient }

type Props = {
    children: React.ReactNode;
    appointment: AppointmentWithPatient;
}

const RecordOutPatientCall: React.FC<Props> = ({ children, appointment }) => {
    console.log(appointment)
    return (
        <div className='flex flex-no-wrap relative h-full'>
            <div className='flex flex-col absolute group hover:cursor-pointer w-60 inset-0 z-50 bg-gray-100'>
                <div className='flex flex-col w-full flex-no-wrap mt-10 items-center'>
                    <img src={appointment.patient.photoUrl} alt='Foto de Perfil'
                        className='border-1 border-white rounded-full w-15 h-15' />
                </div>
                <Disclosure>
                    {({ open }) => (
                        <div className='flex flex-col justify-center bg-white rounded-lg m-2 p-2 gap-3'>
                            <Disclosure.Button className="focus:outline-none ">
                                <div className='flex flex-row flex-no-wrap justify-center text-xl text-cool-gray-700 font-semibold'> 
                                    {toUpperLowerCase(appointment.patient.givenName.split(' ')[0] + ' ' + appointment.patient.familyName.split(' ')[0])}
                                    <ArrowDown className={`${open ? 'rotate-180 transform' : ''}`} />
                                </div>
                                <span className='font-semibold text-base' style={{color:'#ABAFB6'}}>{appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                                    ? 'Paciente sin cédula'
                                    : 'CI ' + appointment.patient.identifier}</span>
                            </Disclosure.Button>
                            <Disclosure.Panel className="focus:outline-none ">
                                <div className='flex flex-col'>
                                    <span className='text-base font-normal' style={{color:'#ABAFB6'}}>Edad</span>
                                    <span className='text-lg font-semibold text-cool-gray-700'>{differenceInYears(Date.now(), new Date(appointment.patient.birthDate))}</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-base font-normal' style={{color:'#ABAFB6'}}>Profesion</span>
                                    <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.job}</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-base font-normal' style={{color:'#ABAFB6'}}>Teléfono</span>
                                    <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.phone}</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-base font-normal' style={{color:'#ABAFB6'}}>Ciudad</span>
                                    <span className='text-lg font-semibold text-cool-gray-700'>{appointment.patient.city}</span>
                                </div>
                            </Disclosure.Panel>
                        </div>
                    )}
                </Disclosure>
            </div>
            {children}
        </div>
    )
}

export default RecordOutPatientCall