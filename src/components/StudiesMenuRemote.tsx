
import axios from "axios"
import React, { useState, useEffect, ChangeEvent } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    Avatar,
    Card,
    Divider,
    Grid,
    Typography,
    MenuItem,
    Select,
    FormControl
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ReactComponent as OrderAdd } from "../assets/post-add.svg"
import { ReactComponent as NoResults } from "../assets/no-results-icon.svg"
import { ReactComponent as SpinnerLoading } from "../assets/spinner-loading.svg"
import { ReactComponent as OtherIcon } from "../assets/icon-other.svg"
import { ReactComponent as ImgIcon } from "../assets/img-icon.svg"
import { ReactComponent as LabIcon } from "../assets/laboratory-icon.svg"
import { ReactComponent as Calendar } from "../assets/calendar-detail.svg"
import { ReactComponent as TesaiSource } from "../assets/svg-sources-studies/tesai-source.svg"
import { ReactComponent as VentrixSource } from "../assets/svg-sources-studies/ventrix-source.svg"
import { ReactComponent as WithoutSource } from "../assets/svg-sources-studies/without-origin.svg"
import { ReactComponent as PatientSource } from "../assets/svg-sources-studies/patient-source.svg"
import moment from 'moment'
import { useToasts } from './Toast';
import Modal from "./Modal";
import type * as CSS from 'csstype';
import StudyOrder from "./studiesorder/StudyOrder";
// import Provider from "./studiesorder/Provider";
import * as Sentry from '@sentry/react'
import { HEIGHT_NAVBAR, TIME_TO_OPEN_APPOINTMENT } from "../util/constants";
import useWindowDimensions from "../util/useWindowDimensions";
import { countDays } from "../util/helpers";
import { useRouteMatch } from "react-router-dom";


//HoverSelect theme
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
            paddingLeft: "0.5rem",
            paddingRight: "0.1rem",
            borderRadius: "0.9rem",
            backgroundColor: "#E5E7EB",
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
            },
            '& .MuiListItem-root.Mui-selected': {
                backgroundColor: "#EDFAFA"
            },
            '& .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
                backgroundColor: "#EDFAFA"
            }
        },
        gridBorder: {
            borderRadius: '20px',
            backgroundColor: "#F7FAFC",
            padding: '15px',
            marginTop: '15px',
            cursor: 'pointer',
            borderWidth: '2px',
            borderColor: 'transparent',
            "&:hover": {
                backgroundColor: "#f3faf7",
                borderColor: "#dff5f6",
                borderWidth: '2px'

            },
        }
    }),
);

//Component to filter by category
const SelectCategory = ({ categorySelect, setCategory }) => {


    const IconLab = () => {
        return (<svg className="inline-block" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2 0C1.17158 0 0.5 0.671575 0.5 1.5V16.5C0.5 17.3284 1.17158 18 2 18H17C17.8284 18 18.5 17.3284 18.5 16.5V1.5C18.5 0.671575 17.8284 0 17 0H2ZM7.9 5L11.6 5.0001V5.50005C11.6 5.64275 11.7113 5.86065 11.9246 6.10185C12.0197 6.20935 12.1163 6.30055 12.1896 6.3651C12.226 6.39705 12.2557 6.4217 12.2755 6.43775C12.2854 6.44575 12.2928 6.45155 12.2972 6.45495L12.3012 6.45805L12.5 6.60795V7.5H11.5V7.0901C11.4085 7.008 11.2926 6.89675 11.1755 6.76425C11.0165 6.58455 10.8117 6.31795 10.6942 6L8.77235 6.00005C8.7465 6.05495 8.71945 6.10535 8.69405 6.15C8.5917 6.33005 8.46165 6.50825 8.34125 6.6596C8.21925 6.8129 8.0985 6.94935 8.0089 7.0469L8 7.0566V12.75C8 13.7165 8.7835 14.5 9.75 14.5C10.4481 14.5 11.0507 14.0913 11.3316 13.5H12.3965C12.07 14.6543 11.0088 15.5 9.75 15.5C8.2312 15.5 7 14.2688 7 12.75V6.65085L7.14535 6.50475L7.1467 6.50335L7.1527 6.4972C7.1583 6.4915 7.1669 6.4827 7.17805 6.47105C7.20045 6.44775 7.233 6.4134 7.27235 6.37055C7.3515 6.28435 7.45575 6.16635 7.55875 6.0369C7.6633 5.9055 7.7583 5.77265 7.8247 5.65585C7.8762 5.5652 7.8925 5.5151 7.89765 5.4993C7.89885 5.4955 7.89945 5.4937 7.89975 5.49375C7.8998 5.49375 7.8997 5.4936 7.89975 5.49375C7.89975 5.49385 7.89995 5.4943 7.89995 5.4945L7.9 5.4966V5ZM13.5 11.0455C13.5 11.8488 12.8285 12.5 12 12.5C11.1715 12.5 10.5 11.8488 10.5 11.0455C10.5 9.77275 12 8.5 12 8.5C12 8.5 13.5 9.77275 13.5 11.0455ZM12 2H7.5V4H12V2Z" fill="#364152" />
        </svg>
        )
    }

    const IconImg = () => {
        return (
            <svg className="inline-block" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.5 1.5C0.5 0.671575 1.17158 0 2 0H17C17.8284 0 18.5 0.671575 18.5 1.5V16.5C18.5 17.3284 17.8284 18 17 18H2C1.17158 18 0.5 17.3284 0.5 16.5V1.5ZM11.75 4.25C11.75 5.49265 10.7427 6.5 9.5 6.5C8.25735 6.5 7.25 5.49265 7.25 4.25C7.25 3.00735 8.25735 2 9.5 2C10.7427 2 11.75 3.00735 11.75 4.25ZM4 8C4 7.72385 4.22385 7.5 4.5 7.5H14.5C14.7761 7.5 15 7.72385 15 8V15.5C15 15.7761 14.7761 16 14.5 16H12C12 15.7014 11.8637 15.4302 11.7149 15.2219C11.5595 15.0043 11.3519 14.801 11.1249 14.6276C10.8106 14.3876 10.4127 14.1706 10 14.066V12.5732H10.7C11.1954 12.5732 11.8186 12.7711 12.3559 12.9974C12.6164 13.1072 12.8421 13.2172 13.0023 13.2997C13.0823 13.3409 13.1455 13.3749 13.188 13.3983C13.2093 13.41 13.2254 13.419 13.2358 13.4249L13.247 13.4313L13.2493 13.4326C13.2493 13.4326 13.2494 13.4326 13.5 13C13.7506 12.5674 13.7506 12.5673 13.7505 12.5673L13.7498 12.5668L13.7484 12.566L13.7437 12.5634L13.7278 12.5543C13.7141 12.5466 13.6946 12.5357 13.6698 12.522C13.6201 12.4948 13.549 12.4564 13.4601 12.4107C13.2829 12.3194 13.0335 12.1977 12.7441 12.0758C12.1814 11.8388 11.4045 11.5732 10.7 11.5732H10V10.5H10.4C10.7744 10.5 11.2423 10.6073 11.6425 10.7285C11.837 10.7875 12.0054 10.8465 12.1248 10.8907C12.1843 10.9128 12.2313 10.931 12.2628 10.9434C12.2746 10.9481 12.2842 10.952 12.2914 10.955C12.2939 10.9559 12.2961 10.9568 12.298 10.9576L12.3062 10.9609L12.3078 10.9616C12.3078 10.9616 12.3077 10.9615 12.5 10.5C12.6923 10.0385 12.6923 10.0384 12.6922 10.0384L12.6904 10.0377L12.6868 10.0362L12.6746 10.0312C12.6642 10.027 12.6494 10.021 12.6306 10.0135C12.593 9.9987 12.5391 9.97785 12.4721 9.953C12.3383 9.90345 12.1504 9.83755 11.9325 9.7715C11.5077 9.64275 10.9255 9.5 10.4 9.5H10V8.5H9V9.5H8.45C7.8498 9.5 7.30385 9.642 6.9157 9.7782C6.71975 9.84695 6.55925 9.91595 6.44615 9.9685C6.38955 9.99485 6.3445 10.0173 6.31255 10.0336C6.2966 10.0418 6.28385 10.0485 6.2746 10.0534L6.26325 10.0596L6.25955 10.0616L6.2582 10.0624L6.25765 10.0626C6.25755 10.0627 6.2572 10.0629 6.5 10.5C6.7428 10.9371 6.7427 10.9372 6.7426 10.9372L6.74615 10.9353C6.75055 10.933 6.7582 10.9289 6.7689 10.9234C6.79025 10.9124 6.82375 10.8958 6.8679 10.8752C6.9564 10.8341 7.0865 10.778 7.2468 10.7218C7.57115 10.608 8.0002 10.5 8.45 10.5H9V11.5732H8.1C7.29525 11.5732 6.56735 11.8377 6.0558 12.0872C5.797 12.2134 5.5857 12.3398 5.4379 12.4353C5.3638 12.4832 5.3052 12.5237 5.26405 12.5531C5.24345 12.5677 5.2272 12.5796 5.2155 12.5883L5.20145 12.5989L5.197 12.6023L5.1955 12.6034L5.19485 12.6039C5.19475 12.604 5.1944 12.6042 5.5 13C5.8056 13.3957 5.8055 13.3958 5.8054 13.3959L5.8121 13.3909C5.8187 13.386 5.8296 13.378 5.84455 13.3673C5.8745 13.346 5.92055 13.314 5.98085 13.275C6.1018 13.1969 6.278 13.0914 6.4942 12.986C6.93265 12.7722 7.50475 12.5732 8.1 12.5732H9V14.0822C8.58535 14.195 8.18465 14.4073 7.86335 14.6492C7.639 14.8181 7.43385 15.0157 7.28025 15.2299C7.1319 15.4367 7 15.7035 7 16H4.5C4.22385 16 4 15.7761 4 15.5V8ZM10.9852 15.9495C10.9978 15.9809 10.9997 15.9972 11 16H8C8.00005 15.9988 8.00095 15.983 8.0139 15.9504C8.0278 15.9154 8.05255 15.8689 8.0928 15.8127C8.17425 15.6993 8.30115 15.5712 8.4648 15.448C8.7939 15.2002 9.1948 15.0281 9.5169 15.0002C9.7937 15.0065 10.1797 15.1641 10.518 15.4224C10.6838 15.549 10.8155 15.6832 10.9011 15.8031C10.9436 15.8625 10.9701 15.912 10.9852 15.9495Z" fill="#364152" />
            </svg>
        )
    }

    const IconOther = () => {
        return (
            <svg className="inline-block" width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.5 1.5C0.5 0.671575 1.17158 0 2 0H17C17.8284 0 18.5 0.671575 18.5 1.5V16.5C18.5 17.3284 17.8284 18 17 18H2C1.17158 18 0.5 17.3284 0.5 16.5V1.5ZM7 3H5.5C4.9477 3 4.5 3.4477 4.5 4V15C4.5 15.5523 4.9477 16 5.5 16H13.5C14.0523 16 14.5 15.5523 14.5 15V4C14.5 3.4477 14.0523 3 13.5 3H12C12 2.4477 11.5523 2 11 2H8C7.4477 2 7 2.4477 7 3ZM8.5319 14.3245L9.7786 11H8.0001C7.724 11 7.5001 10.7761 7.5001 10.5C7.5001 10.2239 7.724 10 8.0001 10H10.4906C10.4969 9.9999 10.5033 9.9999 10.5097 10H10.9904C10.9968 9.9999 11.0032 9.9999 11.0096 10H13.1507C13.4268 10 13.6507 10.2239 13.6507 10.5C13.6507 10.7761 13.4268 11 13.1507 11H11.7215L12.9683 14.3245C13.0652 14.583 12.9342 14.8713 12.6756 14.9682C12.4171 15.0652 12.1288 14.9342 12.0319 14.6756L11.4027 12.9978H10.0974L9.46825 14.6756C9.37125 14.9342 9.08305 15.0652 8.8245 14.9682C8.56595 14.8713 8.43495 14.583 8.5319 14.3245ZM6 6.62H13V5.62H6V6.62ZM8.5 8.7H6V7.7H8.5V8.7ZM10.75 9.5C11.3023 9.5 11.75 9.0523 11.75 8.5C11.75 7.9477 11.3023 7.5 10.75 7.5C10.1977 7.5 9.75 7.9477 9.75 8.5C9.75 9.0523 10.1977 9.5 10.75 9.5ZM8 3H11V4H8V3Z" fill="#364152" />
            </svg>
        )
    }

    //Handle Change Event Select
    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        setCategory(event.target.value as string);
    };

    //Hover theme
    const classes = useStyles();

    return (
        <FormControl>
            <Select className={classes.select}
                value={categorySelect}
                onChange={handleChange}
                displayEmpty
            >
                <MenuItem className={classes.menuItem} value="">
                    Categoría
                </MenuItem>
                <MenuItem className={classes.menuItem} value={'LABORATORY'}><span className="pl-2 pr-2"><IconLab></IconLab></span>Laboratorio</MenuItem>
                <MenuItem className={classes.menuItem} value={'IMAGE'}><span className="pl-2 pr-2"><IconImg></IconImg></span>Imágenes</MenuItem>
                <MenuItem className={classes.menuItem} value={'OTHER'}><span className="pl-2 pr-2"><IconOther></IconOther></span>Otros</MenuItem>
            </Select>
        </FormControl>
    )
}

//parsing category
const categoryIssuedOrders = {
    LABORATORY: 'Laboratory',
    IMAGE: 'Diagnostic Imaging',
    OTHER: 'Other'
}

// Component to filter by date
const DateRever = ({ dateRever, setDateRever, studiesData, setStudiesData }) => {


    const rotate: CSS.Properties = {
        transform: dateRever ? "rotate(180deg)" : "",
    }

    const onClickDate = () => {
        if (studiesData !== undefined) {
            setStudiesData(studiesData.reverse())
            setDateRever(!dateRever)
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#E5E7EB",
            borderRadius: "0.9rem",
            padding: "0.1rem 0.5rem 0.1rem 0.5rem",
            alignItems: 'center',
            gap: "0.2rem",
            cursor: 'pointer',
        }} onClick={onClickDate}>
            {/*Date Icons */}
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4 0.65625C3.73478 0.65625 3.48043 0.761607 3.29289 0.949143C3.10536 1.13668 3 1.39103 3 1.65625V2.65625H2C1.46957 2.65625 0.960859 2.86696 0.585786 3.24204C0.210714 3.61711 0 4.12582 0 4.65625V14.6562C0 15.1867 0.210714 15.6954 0.585786 16.0705C0.960859 16.4455 1.46957 16.6562 2 16.6562H14C14.5304 16.6562 15.0391 16.4455 15.4142 16.0705C15.7893 15.6954 16 15.1867 16 14.6562V4.65625C16 4.12582 15.7893 3.61711 15.4142 3.24204C15.0391 2.86696 14.5304 2.65625 14 2.65625H13V1.65625C13 1.39103 12.8946 1.13668 12.7071 0.949143C12.5196 0.761607 12.2652 0.65625 12 0.65625C11.7348 0.65625 11.4804 0.761607 11.2929 0.949143C11.1054 1.13668 11 1.39103 11 1.65625V2.65625H5V1.65625C5 1.39103 4.89464 1.13668 4.70711 0.949143C4.51957 0.761607 4.26522 0.65625 4 0.65625V0.65625ZM4 5.65625C3.73478 5.65625 3.48043 5.76161 3.29289 5.94914C3.10536 6.13668 3 6.39103 3 6.65625C3 6.92147 3.10536 7.17582 3.29289 7.36336C3.48043 7.55089 3.73478 7.65625 4 7.65625H12C12.2652 7.65625 12.5196 7.55089 12.7071 7.36336C12.8946 7.17582 13 6.92147 13 6.65625C13 6.39103 12.8946 6.13668 12.7071 5.94914C12.5196 5.76161 12.2652 5.65625 12 5.65625H4Z" fill="#718096" />
            </svg>
            <svg style={rotate} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 16.6562C10.1217 16.6562 12.1566 15.8134 13.6569 14.3131C15.1571 12.8128 16 10.778 16 8.65625C16 6.53452 15.1571 4.49969 13.6569 2.9994C12.1566 1.4991 10.1217 0.65625 8 0.65625C5.87827 0.65625 3.84344 1.4991 2.34315 2.9994C0.842855 4.49969 0 6.53452 0 8.65625C0 10.778 0.842855 12.8128 2.34315 14.3131C3.84344 15.8134 5.87827 16.6562 8 16.6562V16.6562ZM11.707 7.94925L8.707 4.94925C8.51947 4.76178 8.26516 4.65646 8 4.65646C7.73484 4.65646 7.48053 4.76178 7.293 4.94925L4.293 7.94925C4.11084 8.13785 4.01005 8.39045 4.01233 8.65265C4.0146 8.91485 4.11977 9.16566 4.30518 9.35107C4.49059 9.53648 4.7414 9.64165 5.0036 9.64392C5.2658 9.6462 5.5184 9.54541 5.707 9.36325L7 8.07025V11.6562C7 11.9215 7.10536 12.1758 7.29289 12.3634C7.48043 12.5509 7.73478 12.6562 8 12.6562C8.26522 12.6562 8.51957 12.5509 8.70711 12.3634C8.89464 12.1758 9 11.9215 9 11.6562V8.07025L10.293 9.36325C10.4816 9.54541 10.7342 9.6462 10.9964 9.64392C11.2586 9.64165 11.5094 9.53648 11.6948 9.35107C11.8802 9.16566 11.9854 8.91485 11.9877 8.65265C11.99 8.39045 11.8892 8.13785 11.707 7.94925V7.94925Z" fill="#13A5A9" />
            </svg>
        </div>
    )
}


export function StudiesMenuRemote({ setPreviewActivate, appointment }) {
    const { addToast } = useToasts()
    const [loading, setLoading] = useState(true)
    const [selectedRow, setSelectedRow] = useState()
    const [studiesData, setStudiesData] = useState(undefined)
    const [studyDetail, setStudyDetail] = useState<any>()
    const [showEditModal, setShowEditModal] = useState(false)
    const [showPreview, setShowPreview] = useState({})
    const [categorySelect, setCategory] = useState("")
    const [dateRever, setDateRever] = useState(false)
    const [loadPreview, setLoadPreview] = useState(false)
    const [filterHide, setFilterHide] = useState(true)
    //const for controlling button navigation view
    const [issueOrder, setIssueOrder] = useState(false)
    //states for displaying issued Orders 
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [issuedStudies, setIssuedStudies] = useState([])
    //toggle studies click event between studies issued(false) and realized studies(true)
    const [toggleStudies, setToggleStudies] = useState(true)
    //select study issued order detail
    const [selectOrderDetail, setSelectOrderDetail] = useState(undefined)
    //disabled issuedOrder button
    const [disabledButton, setDisabledButton] = useState(true)
    // Encounter handler
    let match = useRouteMatch<{ id: string }>('/appointments/:id/call/')
    const id = match?.params.id
    const [emptySoep, setEmptySoep] = useState(false)
    const [encounter, setEncounter] = useState<Boldo.Encounter>(undefined)


    useEffect(() => {
        const load = async () => {
            const url = `/profile/doctor/diagnosticReports?patient_id=${appointment.patientId}`
            try {
                setLoading(true)

                if (appointment !== undefined) {
                    const res = await axios.get(url)
                    // if(res.data.items > 0)
                    setStudiesData(res.data.items)
                    setLoading(false)
                }
            } catch (err) {
                Sentry.setTags({
                    'endpoint': url,
                    'method': 'GET',
                    'appointment_id': appointment.id,
                    'doctor_id': appointment.doctorId,
                    'patient_id': appointment.patientId
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
                Sentry.captureMessage("Could not get the diagnostic report")
                Sentry.captureException(err)
                addToast({
                    type: 'error',
                    title: 'Ha ocurrido un error.',
                    text: 'No pudimos obtener los estudios realizados. ¡Inténtelo nuevamente más tarde!'
                })
                // setLoading(false)
            } finally {
                setLoading(false)
            }
        }

        if (appointment)
            load()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appointment])

    useEffect(() => {
        if (appointment === undefined || appointment.status === 'locked' || appointment.status === 'upcoming') {
            setDisabledButton(true)
        } else {
            setDisabledButton(false)
        }
    }, [appointment])

    const downloadBlob = (url, title, contentType, download) => {
        var oReq = new XMLHttpRequest();
        setLoadPreview(true)
        oReq.open("GET", url, true);
        oReq.responseType = "blob";
        oReq.onload = function () {
            const file = new Blob([oReq.response], { type: contentType });
            const fileURL = URL.createObjectURL(file);
            console.log('file', fileURL)
            if (download === true) {
                const a = document.createElement('a');
                document.body.appendChild(a);
                a.href = fileURL;
                a.download = title;
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }, 0)

            } else {
                //showPreview
                setShowEditModal(true)
                setShowPreview({ contentType: contentType, url: fileURL })
                setLoadPreview(false)
            }

        };

        oReq.send();

    }

    useEffect(() => {
        const load = async () => {
            try {
                setStudyDetail(undefined)
                if (selectedRow !== undefined) {
                    //@ts-ignore
                    const res = await axios.get(`/profile/doctor/diagnosticReport/${selectedRow.id}`)
                    setStudyDetail(res.data)
                }
            } catch (err) {
                if (selectedRow !== undefined) {
                    //@ts-ignore
                    Sentry.setTag('endpoint', `/profile/doctor/diagnosticReport/${selectedRow.id}`)
                }
                Sentry.setTag('method', 'GET')
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
                Sentry.captureMessage("Could not get the study description")
                Sentry.captureException(err)
                addToast({
                    type: 'error',
                    title: 'Ha ocurrido un error',
                    text: 'No pudimos cargar la descripción del estudio. ¡Inténtelo nuevamente más tarde!'
                })
                setSelectedRow(undefined)
                setFilterHide(true)
            } finally {
                // setInitialLoad(false)
            }
        }
        selectedRow !== undefined &&
            load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRow])

    useEffect(() => {
        const loadOrders = async () => {
            const url = `/profile/doctor/serviceRequests?patient_id=${appointment.patientId}`
            try {
                setLoadingOrders(true)
                if (appointment !== undefined) {
                    const res = await axios.get(url)
                    console.log("response orders", res)
                    if (res.status === 200) setIssuedStudies(res.data.items)
                    else if (res.status === 204) setIssuedStudies([])
                    setLoadingOrders(false)
                }
            } catch (err) {
                Sentry.setTags({
                    'endpoint': url,
                    'method': 'GET',
                    'appointment_id': appointment.id,
                    'doctor_id': appointment.doctorId,
                    'patient_id': appointment.patientId
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
                Sentry.captureMessage("Could not get the study orders")
                Sentry.captureException(err)
                addToast({
                    type: 'error',
                    title: 'Ha ocurrido un error',
                    text: 'No se pudieron cargar las órdenes de estudios. ¡Inténtelo nuevamente más tarde!'
                })
            } finally {
                setLoadingOrders(false)
            }
        }
        if (appointment && !issueOrder) loadOrders()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [issueOrder, appointment])

      // this get the encounter
    useEffect(() => {
        const load = async () => {
        const url = `/profile/doctor/appointments/${id}/encounter`
        
        setDisabledButton(true)
        await axios
            .get(url)
            .then((res) => {
            const data = res.data.encounter as Boldo.Encounter
            if (Object.keys(data.soep).length === 0) {
                setEmptySoep(true)
            } else if (!data.soep.evaluation || data.soep.evaluation.trim() === '') {
                setEmptySoep(true)
            } else {
                setEmptySoep(false)
                setEncounter(data)
            }
            })
            .catch((err) => {
            Sentry.setTags({
                'endpoint': url,
                'method': 'GET'
            })
            if (err.response) {
                // The response was made and the server responded with a 
                // status code that is outside the 2xx range.
                Sentry.setTags({
                'data': err.response.data,
                'headers': err.response.headers,
                'status_code': err.response.status
                })
            } else if (err.request) {
                // The request was made but no response was received
                Sentry.setTag('request', err.request)
            } else {
                // Something happened while preparing the request that threw an Error
                Sentry.setTag('message', err.message)
            }
            Sentry.captureMessage("Could not get the encounter")
            Sentry.captureException(err)
            })
        }
        if (appointment)
        load()
    }, [appointment, id])

    useEffect(() => {
        if (appointment === undefined || appointment.status === 'locked' || appointment.status === 'upcoming') {
        setDisabledButton(true)
        } else {
        setDisabledButton(false)
        }
    }, [appointment, emptySoep])

    //Hover theme
    const classes = useStyles();

    const { height: screenHeight } = useWindowDimensions()

    return (
        <div className='flex flex-col bg-white shadow-xl relative overflow-hidden' style={{ height: "100%" }}>
            <Grid>
                <Grid container style={{ backgroundColor: '#27BEC2', color: 'white', alignItems: 'center', minHeight: '70px' }}>
                    {selectedRow || issueOrder || selectOrderDetail ? <button
                        style={{ backgroundColor: '#27BEC2', height: '48px', width: '48px' }}
                        className='flex items-center justify-center  rounded-full focus:outline-none focus:bg-gray-600'
                        onClick={() => {
                            setSelectedRow(undefined);
                            setSelectOrderDetail(undefined)
                            setFilterHide(true);
                            setIssueOrder(false);
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 7.0007H3.82998L8.70998 2.1207C9.09998 1.7307 9.09998 1.0907 8.70998 0.700703C8.31998 0.310703 7.68998 0.310703 7.29998 0.700703L0.70998 7.2907C0.31998 7.6807 0.31998 8.3107 0.70998 8.7007L7.29998 15.2907C7.68998 15.6807 8.31998 15.6807 8.70998 15.2907C9.09998 14.9007 9.09998 14.2707 8.70998 13.8807L3.82998 9.0007H15C15.55 9.0007 16 8.5507 16 8.0007C16 7.4507 15.55 7.0007 15 7.0007Z" fill="white" />
                        </svg>


                    </button>
                        :
                        <Grid style={{ marginLeft: '20px' }}></Grid>
                    }
                    {
                        issueOrder ? <Typography variant='h6'>Nueva Orden de estudios</Typography> : selectOrderDetail ? <Typography variant='h6'>Estudios a Realizar</Typography> : <Typography variant='h6'>Listado de Estudios</Typography>
                    }

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
                                {appointment.patient.identifier == null || appointment.patient.identifier.includes('-')
                                    ? 'Paciente sin cédula'
                                    : 'CI ' + appointment.patient.identifier}
                            </Typography>

                        </div>
                    </div>

                    {!issueOrder && !selectedRow && !selectOrderDetail &&
                        <div className="flex flex-row flex-no-wrap">
                            <div className="flex flex-row w-full">
                                <div className={`flex flex-row justify-center border-b-2  ${!toggleStudies ? 'border-primary-600' : 'border-gray-300'} `}
                                    style={{ width: '100%', height: '3rem' }}
                                >
                                    <button
                                        className={`flex items-center h-ful text-sm font-semibold focus:outline-none ${!toggleStudies ? 'text-primary-600' : 'text-gray-400'}`}
                                        onClick={() => {
                                            setToggleStudies(false)
                                        }}
                                    >
                                        Órdenes de estudio
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-row w-full">
                                <div className={`flex flex-row justify-center border-b-2  ${toggleStudies ? 'border-primary-600' : 'border-gray-300'} `}
                                    style={{ width: '100%', height: '3rem' }}
                                >
                                    <button
                                        className={`flex items-center h-ful text-sm font-semibold focus:outline-none ${toggleStudies ? 'text-primary-600' : 'text-gray-400'}`}
                                        onClick={() => {
                                            setToggleStudies(true)
                                        }}
                                    >
                                        Estudios Realizados
                                    </button>
                                </div>
                            </div>
                        </div>
                    }

                    {issueOrder && loading === false && studyOrderView()}
                    {
                        filterHide === true && (
                            <div style={{ display: "flex", marginTop: "0.7rem", justifyContent: "space-between" }}>
                                <SelectCategory categorySelect={categorySelect} setCategory={setCategory} ></SelectCategory>
                                <DateRever dateRever={dateRever}
                                    setDateRever={setDateRever}
                                    studiesData={toggleStudies ? studiesData : issuedStudies}
                                    setStudiesData={toggleStudies ? setStudiesData : setIssuedStudies}></DateRever>
                            </div>
                        )
                    }

                    {/*Empty studiesData*/}
                    {issueOrder === false && toggleStudies && loading === false && studiesData === undefined && <Grid className="grid mt-20 place-items-center"  >
                        <NoResults />
                    </Grid>
                    }

                    {/*Empty issuedStudies*/}
                    {issueOrder === false && !toggleStudies && loadingOrders === false && issuedStudies.length === 0 && <Grid className="grid mt-20 place-items-center"  >
                        <NoResults />
                    </Grid>
                    }

                    {!issueOrder && <Grid className={`mt-3 ${loadingOrders ? '' : 'overflow-y-auto scrollbar'}`} style={{ height: `${screenHeight - (HEIGHT_NAVBAR + 300)}px` }} >
                        {(loading || loadingOrders) && <div className='flex items-center justify-center w-full h-full py-64'>
                            <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
                                <SpinnerLoading />
                            </div>
                        </div>
                        }
                        {
                            selectedRow ?
                                laboratoryDetail() : issueOrder === false && loading === false && loadingOrders === false && toggleStudies && studiesData !== undefined && studiesData.length > 0 &&
                                studiesData.filter((data) => (data.category === categorySelect || categorySelect === "")).map((item, index) => (
                                    <Grid
                                        className={classes.gridBorder}
                                        onClick={() => {
                                            setSelectedRow(item)
                                            setFilterHide(false)
                                        }}
                                        key={index}
                                    >
                                        <Grid justifyContent="space-between" container>
                                            <div style={{ display: 'flex' }}>
                                                {item.category === "LABORATORY" ?
                                                    <LabIcon width={22} height={22} preserveAspectRatio="none" />
                                                    : item.category === "IMAGE" ?
                                                        <ImgIcon width={22} height={22} preserveAspectRatio="none" /> :
                                                        <OtherIcon width={22} height={22} preserveAspectRatio="none" />
                                                }
                                                <Typography variant='body2' color='textSecondary' style={{ marginLeft: '10px', }}>
                                                    {item.category === "LABORATORY" ? "Laboratorio"
                                                        : item.category === "IMAGE" ? "Imágenes"
                                                            : "Otros"
                                                    }
                                                </Typography>
                                            </div>
                                            <Typography variant='body2' color='textSecondary'>
                                                {moment(item.effectiveDate).format('DD/MM/YYYY')}
                                            </Typography>
                                        </Grid>
                                        <Typography style={{ color: '#13A5A9' }} variant='body1' >
                                            {item.description}
                                        </Typography>

                                        <Typography variant='body2' color='textSecondary'>
                                            {item.source}
                                        </Typography>
                                    </Grid>
                                ))
                        }
                        {selectOrderDetail ? orderDetail(selectOrderDetail) : !issueOrder && !loadingOrders && !toggleStudies && issuedStudies && issuedStudies.length > 0 && issuedStudies.filter((data) => (data.category === categoryIssuedOrders[categorySelect] || categorySelect === "")).map((item, index) => (
                            <Grid
                                className={classes.gridBorder}
                                onClick={() => {
                                    setSelectOrderDetail(item)
                                    setFilterHide(false)
                                }}
                                key={index}
                            >
                                <Grid justifyContent="space-between" container>
                                    <div style={{ display: 'flex' }}>
                                        {item.category === "Laboratory" ?
                                            <LabIcon width={22} height={22} preserveAspectRatio="none" />
                                            : item.category === "Diagnostic Imaging" ?
                                                <ImgIcon width={22} height={22} preserveAspectRatio="none" /> :
                                                <OtherIcon width={22} height={22} preserveAspectRatio="none" />
                                        }
                                        <Typography variant='body2' color='textSecondary' style={{ marginLeft: '10px', }}>
                                            {item.category === "Laboratory" ? "Laboratorio"
                                                : item.category === "Diagnostic Imaging" ? "Imágenes"
                                                    : "Otros"
                                            }
                                        </Typography>
                                    </div>
                                    <Typography variant='body2' color='textSecondary'>
                                        {moment(item.authoredDate).format('DD/MM/YYYY')}
                                    </Typography>
                                </Grid>
                                <Typography style={{ color: '#13A5A9', width: '12rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} variant='body1' >
                                    {item.studiesCodes.map(i => { return i.display }).join(', ')}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>}
                </Grid>
            </Grid>
            {!selectedRow && issueOrder === false && appointment && (
                <div
                    className="flex flex-row pt-1 pb-1 fixed right-4 bottom-4"
                    title={
                        disabledButton
                            ? appointment.status === 'locked'
                                ? 'No disponible en citas culminadas'
                                : 'La gestión de órdenes se habilitará ' + TIME_TO_OPEN_APPOINTMENT + ' minutos antes del inicio de la cita'
                            : 'Aquí puede gestionar las órdenes de estudio y emitirlas'
                    }
                >
                    <button className={`btn ${disabledButton ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary-600'} text-white border-transparent focus:outline-none flex flex-row justify-end items-center px-2 py-0 h-10 rounded-l-3xl rounded-r-3xl text-clip md-max:mt-2`}
                        onClick={() => {
                            setIssueOrder(true)
                            setFilterHide(false)
                        }}
                        disabled={disabledButton}
                    >
                        <div>Emitir orden de estudio</div>
                        <OrderAdd className="mx-0.5 p-0 "></OrderAdd>
                    </button>
                </div>
            )}
        </div>
    )

    function laboratoryDetail() {

        if (studyDetail === undefined)
            return (
                <div className='flex items-center justify-center w-full h-full py-64'>
                    <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
                        <SpinnerLoading />
                    </div>
                </div>
            )

        const getSourceSVG = (source: string) => {
            if (source === '' || source === null) return <WithoutSource />;
            if (source.toLowerCase() === 'tesâi') return <TesaiSource />;
            if (source.toLowerCase() === 'ventrix') return <VentrixSource />;
            return <PatientSource />;
        }

        return <div>
            <Grid className='w-full '>
                <Grid container justifyContent="space-between">
                    <Card
                        style={{
                            // backgroundColor: '#F7FAFC',
                            borderRadius: '16px',
                            boxShadow: 'none',

                            paddingLeft: '15px',

                        }}
                    >

                        <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
                            Resultados de fecha:
                        </Typography>

                        <Grid container>
                            <svg className="m-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 5V1M14 5V1M5 9H15M3 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3H3C2.46957 3 1.96086 3.21071 1.58579 3.58579C1.21071 3.96086 1 4.46957 1 5V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19Z" stroke="#DF6D51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <Grid>
                                <Typography variant='subtitle1' color='textSecondary'>
                                    { //@ts-ignore
                                        moment(studyDetail.effectiveDate).format('DD/MM/YYYY')
                                    }
                                </Typography>
                                <Typography style={{ marginTop: '-5px' }} variant='body1' color='textPrimary'>
                                    {
                                        countDays(studyDetail?.effectiveDate)
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                    <Card
                        style={{
                            // backgroundColor: '#F7FAFC',
                            borderRadius: '16px',
                            boxShadow: 'none',
                            marginBottom: '15px',
                            padding: '15px',
                        }}
                    >
                        <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
                            Origen
                        </Typography>
                        {//@ts-ignore
                            getSourceSVG(studyDetail.source)}
                    </Card>
                </Grid>
                <Card
                    className="mt-3"
                    style={{
                        backgroundColor: '#F7FAFC',
                        borderRadius: '16px',
                        boxShadow: 'none',
                        marginBottom: '15px',
                        padding: '15px',
                        minHeight: '100px'
                    }}
                >
                    <Typography variant='h6' noWrap style={{ textAlign: 'left', color: 'textPrimary' }}>
                        Conclusión
                    </Typography>


                </Card>
                <Grid
                    style={{
                        padding: '15px',
                    }}
                >
                    <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
                        Orden
                    </Typography>

                    <Typography variant='body2' color='textSecondary'>
                        Sin orden
                    </Typography>
                </Grid>
                <Grid
                    className="mt-5"
                >
                    <Divider
                        style={{
                            height: '1px',
                            // width: '100%',
                            background: '#EDF2F7',
                        }}
                    />

                    <Grid className="mt-5" style={{

                        padding: '15px',
                    }} container>
                        <svg className="mt-2" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.172 4.99968L5.58602 11.5857C5.395 11.7702 5.24264 11.9909 5.13782 12.2349C5.033 12.4789 4.97783 12.7413 4.97552 13.0069C4.97321 13.2724 5.02381 13.5358 5.12438 13.7816C5.22494 14.0274 5.37344 14.2507 5.56123 14.4385C5.74902 14.6263 5.97232 14.7748 6.21811 14.8753C6.4639 14.9759 6.72726 15.0265 6.99282 15.0242C7.25838 15.0219 7.52082 14.9667 7.76483 14.8619C8.00884 14.7571 8.22953 14.6047 8.41402 14.4137L14.828 7.82768C15.5567 7.07327 15.9598 6.06286 15.9507 5.01407C15.9416 3.96528 15.5209 2.96203 14.7793 2.2204C14.0377 1.47877 13.0344 1.05809 11.9856 1.04898C10.9368 1.03987 9.92643 1.44304 9.17202 2.17168L2.75702 8.75668C1.63171 9.88199 0.999512 11.4082 0.999512 12.9997C0.999512 14.5911 1.63171 16.1174 2.75702 17.2427C3.88233 18.368 5.40859 19.0002 7.00002 19.0002C8.59145 19.0002 10.1177 18.368 11.243 17.2427L17.5 10.9997" stroke="#364152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <Typography variant='h6' noWrap style={{ paddingLeft: '10px', textAlign: 'left', color: 'textPrimary' }}>
                            Adjuntos
                        </Typography>
                    </Grid>
                    <div className="p-3 flex-col w-100">
                        {
                            //@ts-ignore
                            studyDetail.attachmentUrls.map((book, idx) => {
                                const { contentType, title, url } = book;
                                return (
                                    <section key={idx} style={{ backgroundColor: '#F7FAFC' }} className="flex-shrink-0 rounded-full mb-3">
                                        <Grid className="p-2" container wrap="nowrap">
                                            {
                                                contentType.includes("pdf") ? <svg className="mt-2 w-12" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM9.5 7.5C9.5 8.33 8.83 9 8 9H7V10.25C7 10.66 6.66 11 6.25 11C5.84 11 5.5 10.66 5.5 10.25V6C5.5 5.45 5.95 5 6.5 5H8C8.83 5 9.5 5.67 9.5 6.5V7.5ZM14.5 9.5C14.5 10.33 13.83 11 13 11H11C10.72 11 10.5 10.78 10.5 10.5V5.5C10.5 5.22 10.72 5 11 5H13C13.83 5 14.5 5.67 14.5 6.5V9.5ZM18.5 5.75C18.5 6.16 18.16 6.5 17.75 6.5H17V7.5H17.75C18.16 7.5 18.5 7.84 18.5 8.25C18.5 8.66 18.16 9 17.75 9H17V10.25C17 10.66 16.66 11 16.25 11C15.84 11 15.5 10.66 15.5 10.25V6C15.5 5.45 15.95 5 16.5 5H17.75C18.16 5 18.5 5.34 18.5 5.75ZM7 7.5H8V6.5H7V7.5ZM1 4C0.45 4 0 4.45 0 5V18C0 19.1 0.9 20 2 20H15C15.55 20 16 19.55 16 19C16 18.45 15.55 18 15 18H3C2.45 18 2 17.55 2 17V5C2 4.45 1.55 4 1 4ZM12 9.5H13V6.5H12V9.5Z" fill="#E53E3E" />
                                                </svg> : <svg className="mt-2 w-12" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 9.25C10.24 9.25 11.25 8.24 11.25 7C11.25 5.76 10.24 4.75 9 4.75C7.76 4.75 6.75 5.76 6.75 7C6.75 8.24 7.76 9.25 9 9.25ZM13.5 13.25C13.5 11.75 10.5 11 9 11C7.5 11 4.5 11.75 4.5 13.25V14H13.5V13.25ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM15 16H3C2.45 16 2 15.55 2 15V3C2 2.45 2.45 2 3 2H15C15.55 2 16 2.45 16 3V15C16 15.55 15.55 16 15 16Z" fill="#3182CE" />
                                                </svg>}

                                            <Typography variant='subtitle1' title={book.title} noWrap style={{ paddingTop: '2px', paddingLeft: '10px', textAlign: 'left', color: '#6B7280' }}>
                                                {book.title}
                                            </Typography>
                                            <button

                                                style={{ backgroundColor: '#FBFDFE', height: '35px', width: '35px' }}
                                                className='flex items-center justify-center ml-3 rounded-full focus:outline-none focus:bg-gray-600'
                                                onClick={() => {
                                                    downloadBlob(url, title, contentType, true)
                                                }}
                                            >
                                                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 13V14C1 14.7956 1.31607 15.5587 1.87868 16.1213C2.44129 16.6839 3.20435 17 4 17H14C14.7956 17 15.5587 16.6839 16.1213 16.1213C16.6839 15.5587 17 14.7956 17 14V13M13 9L9 13M9 13L5 9M9 13V1" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>



                                            </button>

                                            <button
                                                style={{ backgroundColor: '#EDF2F7', height: '35px', width: '35px' }}
                                                className='flex items-center justify-center ml-3 rounded-full focus:outline-none focus:bg-gray-600'
                                                onClick={() => {
                                                    setShowEditModal(true);
                                                    setPreviewActivate(true);
                                                    if (contentType.includes("pdf")) {
                                                        downloadBlob(url, title, contentType, false)

                                                    } else {
                                                        setShowPreview({ contentType: contentType, url: url })
                                                    }

                                                }}
                                            >
                                                <svg width="18" height="15" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.0001 11.3996C12.6366 11.3996 13.2471 11.1468 13.6972 10.6967C14.1472 10.2466 14.4001 9.63613 14.4001 8.99961C14.4001 8.36309 14.1472 7.75264 13.6972 7.30255C13.2471 6.85247 12.6366 6.59961 12.0001 6.59961C11.3636 6.59961 10.7531 6.85247 10.303 7.30255C9.85295 7.75264 9.6001 8.36309 9.6001 8.99961C9.6001 9.63613 9.85295 10.2466 10.303 10.6967C10.7531 11.1468 11.3636 11.3996 12.0001 11.3996Z" fill="#6B7280" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.549805 8.99961C2.0786 4.13121 6.6266 0.599609 12.0002 0.599609C17.3738 0.599609 21.9218 4.13121 23.4506 8.99961C21.9218 13.868 17.3738 17.3996 12.0002 17.3996C6.6266 17.3996 2.0786 13.868 0.549805 8.99961ZM16.8002 8.99961C16.8002 10.2726 16.2945 11.4935 15.3943 12.3937C14.4941 13.2939 13.2732 13.7996 12.0002 13.7996C10.7272 13.7996 9.50627 13.2939 8.60609 12.3937C7.70592 11.4935 7.2002 10.2726 7.2002 8.99961C7.2002 7.72657 7.70592 6.50567 8.60609 5.6055C9.50627 4.70532 10.7272 4.19961 12.0002 4.19961C13.2732 4.19961 14.4941 4.70532 15.3943 5.6055C16.2945 6.50567 16.8002 7.72657 16.8002 8.99961Z" fill="#6B7280" />
                                                </svg>

                                            </button>

                                        </Grid>
                                    </section>

                                );
                            })



                        }

                    </div>

                </Grid>
            </Grid>

            <Modal show={showEditModal} setShow={setShowEditModal} size='xl3' bgTransparent={false}   >
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    width: '100%',
                    marginBottom: '0.5rem'
                }}>
                    <button onClick={() => { setShowEditModal(false) }}><CloseIcon></CloseIcon></button>
                </div>
                {
                    // eslint-disable-next-line jsx-a11y/alt-text
                    !loadPreview ? (showPreview['contentType'] !== undefined && showPreview['contentType'].includes("pdf") ? <object data={showPreview['url']} width="700" height="700" type="application/pdf"></object> : <img src={showPreview['url']} alt="img" />) : (
                        <div style={{ width: '300px', margin: 'auto', opacity: '0.5' }} className='flex items-center justify-center w-full h-full py-64'>
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
                }

            </Modal>
        </div>
    }

    function orderDetail(detail) {

        return <div>
            <Grid className='w-full '>
                <Grid container justifyContent="space-between">
                    <Card
                        style={{
                            borderRadius: '16px',
                            boxShadow: 'none',
                            paddingLeft: '15px',
                        }}
                    >
                        <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
                            Solicitado en fecha
                        </Typography>
                        <Grid container>
                            <Calendar />
                            <Grid>
                                <Typography variant='subtitle1' color='textSecondary'>
                                    { //@ts-ignore
                                        moment(detail.authoredDate).format('DD/MM/YYYY')
                                    }
                                </Typography>
                                <Typography style={{ marginTop: '-5px' }} variant='body1' color='textPrimary'>
                                    {
                                        countDays(detail.authoredDate)
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
                <Card
                    style={{
                        // backgroundColor: '#F7FAFC',
                        borderRadius: '16px',
                        boxShadow: 'none',
                        marginBottom: '15px',
                        padding: '15px',
                    }}
                >
                    <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
                        Impresión diagnostica
                    </Typography>
                    {detail.diagnosis}
                </Card>
                <Card
                    className="mt-3"
                    style={{
                        backgroundColor: '#F7FAFC',
                        borderRadius: '16px',
                        boxShadow: 'none',
                        marginBottom: '15px',
                        padding: '15px',
                        minHeight: '100px'
                    }}
                >

                    <Typography variant='h6' noWrap style={{ textAlign: 'left', color: 'textPrimary' }}>
                        <div style={{ display: 'flex' }}>
                            {detail.category === "Laboratory" ?
                                <LabIcon width={22} height={22} preserveAspectRatio="none" />
                                : detail.category === "Diagnostic Imaging" ?
                                    <ImgIcon width={22} height={22} preserveAspectRatio="none" /> :
                                    <OtherIcon width={22} height={22} preserveAspectRatio="none" />
                            }
                            <Typography variant='body2' color='textSecondary' style={{ marginLeft: '10px', }}>
                                {detail.category === "Laboratory" ? "Laboratorio"
                                    : detail.category === "Diagnostic Imaging" ? "Imágenes"
                                        : "Otros"
                                }
                            </Typography>
                        </div>
                        <Typography style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                            {detail.studiesCodes.map((i, index) => (<li key={index}>{i.display}</li>))}
                        </Typography>
                    </Typography>
                    <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280', marginTop: '1rem' }}>
                        Observaciones
                    </Typography>
                    {detail.notes ?? 'Sin observaciones.'}
                </Card>
            </Grid>
        </div>
    }

    function studyOrderView() {
        return (
            <div id="study_orders" className="overflow-y-auto scrollbar" style={{ height: 'calc( 100vh - 220px)' }}>
                {console.log("encounter => ", encounter)}
                <StudyOrder setShowMakeOrder={setIssueOrder} remoteMode={true} encounter={encounter}></StudyOrder>
            </div>
        )
    }
}