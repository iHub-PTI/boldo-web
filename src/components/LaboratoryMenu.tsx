
import axios from "axios"
import React, { useState, useEffect } from 'react'
import { useRouteMatch } from "react-router-dom"
import {
    Grid,
    Typography,
} from '@material-ui/core';
import MaterialTable from "material-table";

export function LaboratoryMenu({ appointment, isFromInperson = false }: { appointment: any; isFromInperson: boolean }) {

    const [initialLoad, setInitialLoad] = useState(true)

    let match = useRouteMatch<{ id: string }>(`/appointments/:id/${!isFromInperson ? 'call' : 'inperson'}`)
    const id = match?.params.id

    const [selectedRow, setSelectedRow] = useState()
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axios.get(`/profile/doctor/diagnosticReports?patient_id=15383`)
                console.log("resultado:",res)

            } catch (err) {
                console.log(err)
            } finally {
                setInitialLoad(false)
            }
        }

        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    if (initialLoad)
        return (
            <div style={{ width: '300px' }} className='flex items-center justify-center w-full h-full py-64'>
                <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
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
                </div>
            </div>
        )
    return (
        <div className='flex flex-col h-full overflow-y-scroll bg-white shadow-xl'>
            <Grid>

                <Grid className='w-full px-8 mt-10'>
                    <Grid>
                        <Typography variant='h5' color='textPrimary'>
                            Resultados de estudios
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                            Archivos subidos por el paciente
                        </Typography>
                    </Grid>


                    <Grid className="mt-10">
                        <MaterialTable
                            columns={[

                                // {
                                //     title: "Cagtegoria",
                                //     field: "mainReason"
                                // },
                                {
                                    title: 'Categoria',
                                    field: 'mainReason',
                                    render: rowData => {
                                        // console.log(rowData.diagnosis)
                                        //@ts-ignore
                                        return (
                                            <Grid container>
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 0C0.671575 0 0 0.671575 0 1.5V16.5C0 17.3285 0.671575 18 1.5 18H16.5C17.3285 18 18 17.3285 18 16.5V1.5C18 0.671575 17.3285 0 16.5 0H1.5ZM7.4 5L11.1 5.0001V5.50005C11.1 5.64275 11.2113 5.86065 11.4246 6.10185C11.5197 6.20935 11.6162 6.30055 11.6896 6.3651C11.7259 6.39705 11.7557 6.4217 11.7755 6.43775C11.7854 6.44575 11.7928 6.45155 11.7972 6.45495L11.8012 6.45805L12 6.60795V7.5H11V7.0901C10.9084 7.008 10.7926 6.89675 10.6755 6.76425C10.5165 6.58455 10.3117 6.31795 10.1942 6L8.27235 6.00005C8.2465 6.05495 8.21945 6.10535 8.19405 6.15C8.0917 6.33005 7.96165 6.50825 7.84125 6.6596C7.71925 6.8129 7.5985 6.94935 7.5089 7.0469L7.5 7.0566V12.75C7.5 13.7165 8.2835 14.5 9.25 14.5C9.9481 14.5 10.5508 14.0913 10.8316 13.5H11.8965C11.57 14.6543 10.5088 15.5 9.25 15.5C7.7312 15.5 6.5 14.2688 6.5 12.75V6.65085L6.64535 6.50475L6.6467 6.50335L6.6527 6.4972C6.6583 6.4915 6.6669 6.4827 6.67805 6.47105C6.70045 6.44775 6.733 6.4134 6.77235 6.37055C6.8515 6.28435 6.95575 6.16635 7.05875 6.0369C7.1633 5.9055 7.2583 5.77265 7.3247 5.65585C7.3762 5.5652 7.3925 5.5151 7.39765 5.4993C7.39885 5.4955 7.39945 5.4937 7.39975 5.49375C7.3998 5.49375 7.3997 5.4936 7.39975 5.49375C7.39975 5.49385 7.39995 5.4943 7.39995 5.4945L7.4 5.4966V5ZM13 11.0455C13 11.8488 12.3285 12.5 11.5 12.5C10.6715 12.5 10 11.8488 10 11.0455C10 9.77275 11.5 8.5 11.5 8.5C11.5 8.5 13 9.77275 13 11.0455ZM11.5 2H7V4H11.5V2Z" fill="#364152" />
                                                </svg> <p style={{ marginLeft: '10px' }}> </p> {rowData.mainReason !== null && rowData.mainReason}
                                            </Grid>
                                        )

                                    },
                                },

                                {
                                    title: "Fecha",
                                    field: "startTimeDate",
                                    width: "10%"
                                },
                                // {
                                //   title: "Diagnóstico",
                                //   field: "diagnosis"
                                // },
                                {
                                    title: 'Descripción',
                                    field: 'diagnosis',
                                    render: rowData => {
                                        // console.log(rowData.diagnosis)
                                        //@ts-ignore
                                        return (
                                            <Grid container>
                                                <p style={{ marginTop: '3px' }}></p> {rowData.diagnosis !== null && rowData.diagnosis} <img src={"https://s3-alpha-sig.figma.com/img/b169/bf3c/235ebca03b877ae8884706fb6a1385d8?Expires=1657497600&Signature=bae3SBcdgXL3P9t9gnDeOKuUuXQDc57mW70QOM-f1tc7XXkPV8BZsyFZtEQdOeAKuTfWgy~rW-PIXpKOckKPensRGhv05QAkNTnhyfQ1in~N6IiKhTRUAQa-gWh6rxnYWhzgxo7xXOD~XOOgL~Ml4JB0Ik2t1PnOmV5W1CIqEcIvj0aOj7Jy-4SNjEFhR4oMr8LMHMgXvGJUXLn6AOG~z-dI8k5D3ABNJkzEuC6iIJQV4GD5SGiucORHGvEZDwiDsoWnAyFdueSJfpH7B~PFJOloq2kFyYrgB3znBJTbtR5pSi3G-vScIE3hR0hwb8DHaDBJm44hkhU3TpsNeeFEdw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"} width='30px' alt='loading...' />
                                            </Grid>
                                        )
                                    },
                                },

                            ]}
                            data={[
                                {
                                    "id": "1",
                                    "startTimeDate": "27/06/2022",
                                    "mainReason": "Laboratorio",
                                    "diagnosis": "Hemograma completo + Orina",

                                },
                                {
                                    "id": "2",
                                    "mainReason": "Imágenes ",
                                    "startTimeDate": "15/06/2022",
                                    "diagnosis": "Radiografía de torax con contraste",

                                },
                                {
                                    "id": "3",
                                    "mainReason": "Cardiológico",
                                    "startTimeDate": "04/05/2022",
                                    "diagnosis": "Ecocardiograma",

                                },
                                {
                                    "id": "4",
                                    "mainReason": "Cardiológico",
                                    "startTimeDate": "04/05/2022",
                                    "diagnosis": "Ecocardiograma",

                                },
                                {
                                    "id": "5",
                                    "startTimeDate": "27/06/2022",
                                    "mainReason": "Laboratorio",
                                    "diagnosis": "Hemograma completo + Orina",

                                },
                                {
                                    "id": "6",
                                    "mainReason": "Imágenes ",
                                    "startTimeDate": "15/06/2022",
                                    "diagnosis": "Radiografía de torax con contraste",

                                },
                                {
                                    "id": "7",
                                    "mainReason": "Cardiológico",
                                    "startTimeDate": "04/05/2022",
                                    "diagnosis": "Ecocardiograma",

                                },
                                {
                                    "id": "8",
                                    "mainReason": "Cardiológico",
                                    "startTimeDate": "04/05/2022",
                                    "diagnosis": "Ecocardiograma",

                                },
                            ]}
                            onRowClick={(evt, selectedRow) =>
                                //@ts-ignore
                                setSelectedRow(selectedRow)
                            }
                            options={{
                                search: false,

                                toolbar: false,
                                paging: false,
                                draggable: false,

                                rowStyle: (rowData) => ({
                                    backgroundColor:
                                        // @ts-ignore
                                        selectedRow !== undefined && selectedRow.id === rowData.id ? "#D4F2F3" : "#FFF",
                                }),
                            }}
                        />

                    </Grid>
                </Grid>
            </Grid>

        </div>
    )
}