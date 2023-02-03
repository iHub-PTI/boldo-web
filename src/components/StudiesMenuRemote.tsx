
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
import moment from 'moment'
import { useToasts } from './Toast';
import Modal from "./Modal";
import type * as CSS from 'csstype';
import StudyOrder from "./studiesorder/StudyOrder";
import Provider from "./studiesorder/Provider";
import * as Sentry from '@sentry/react'
import { HEIGHT_NAVBAR, TIME_TO_OPEN_APPOINTMENT } from "../util/constants";
import useWindowDimensions from "../util/useWindowDimensions";


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
    const [studyDetail, setStudyDetail] = useState()
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
                    <Grid container>
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
                        <Grid className='p-3 '>
                            <Typography variant='body1' color='textPrimary'>
                                {appointment && appointment.patient.givenName}  {appointment && appointment.patient.familyName}
                            </Typography>
                            <Typography variant='body2' color='textSecondary'>
                                Ci:   {appointment && appointment.patient.identifier}
                            </Typography>

                        </Grid>
                    </Grid>

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

        var days_diff = -1;

        if (studyDetail === undefined)
            return (
                <div className='flex items-center justify-center w-full h-full py-64'>
                    <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
                        <SpinnerLoading />
                    </div>
                </div>
            )

        if (studyDetail !== undefined) {
            const currentDate = moment(new Date());
            //@ts-ignore
            const returnDate = moment(studyDetail.effectiveDate);
            days_diff = currentDate.diff(returnDate, 'days');

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
                                <path d="M6 5V1M14 5V1M5 9H15M3 19H17C17.5304 19 18.0391 18.7893 18.4142 18.4142C18.7893 18.0391 19 17.5304 19 17V5C19 4.46957 18.7893 3.96086 18.4142 3.58579C18.0391 3.21071 17.5304 3 17 3H3C2.46957 3 1.96086 3.21071 1.58579 3.58579C1.21071 3.96086 1 4.46957 1 5V17C1 17.5304 1.21071 18.0391 1.58579 18.4142C1.96086 18.7893 2.46957 19 3 19Z" stroke="#DF6D51" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <Grid>
                                <Typography variant='subtitle1' color='textSecondary'>
                                    { //@ts-ignore
                                        moment(studyDetail.effectiveDate).format('DD/MM/YYYY')
                                    }
                                </Typography>
                                <Typography style={{ marginTop: '-5px' }} variant='body1' color='textPrimary'>
                                    {
                                        days_diff < 0 ? 'día invalido' : days_diff === 0 ? 'Hoy' : days_diff === 1 ? 'Ayer' : 'hace ' + days_diff + ' días'
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
                        <svg width="198" height="42" viewBox="0 0 198 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M38.0664 27.9485V11.0488H44.8329C46.0802 11.0488 47.1178 11.2365 47.9457 11.6007C48.7735 11.965 49.4027 12.4838 49.8222 13.1351C50.2416 13.7863 50.4514 14.5369 50.4514 15.3869C50.4514 16.0492 50.3189 16.6232 50.054 17.1199C49.7891 17.6166 49.4248 18.025 48.9722 18.3451C48.5086 18.6652 47.9898 18.886 47.4048 19.0185V19.184C48.045 19.2061 48.6521 19.3938 49.2151 19.7249C49.778 20.0561 50.2416 20.5307 50.5838 21.1268C50.9371 21.7339 51.1137 22.4403 51.1137 23.2793C51.1137 24.1734 50.8929 24.9791 50.4514 25.6746C50.0098 26.381 49.3586 26.9329 48.4866 27.3413C47.6256 27.7498 46.5548 27.9485 45.2965 27.9485H38.0664ZM41.6428 18.1244H44.292C44.7777 18.1244 45.2192 18.0361 45.5945 17.8595C45.9809 17.6828 46.2789 17.44 46.4997 17.1199C46.7204 16.7998 46.8308 16.4134 46.8308 15.9719C46.8308 15.3648 46.61 14.8681 46.1795 14.4928C45.7491 14.1175 45.1309 13.9298 44.3472 13.9298H41.6318V18.1244H41.6428ZM41.6428 25.0343H44.5569C45.5504 25.0343 46.2789 24.8467 46.7315 24.4604C47.184 24.074 47.4158 23.5662 47.4158 22.926C47.4158 22.4624 47.3055 22.043 47.0736 21.6897C46.8529 21.3365 46.5328 21.0495 46.1133 20.8508C45.6939 20.6521 45.2082 20.5418 44.6342 20.5418H41.6428V25.0343Z" fill="#27BEC2" />
                            <path d="M75.9165 19.5042C75.9165 21.3476 75.5633 22.9151 74.8679 24.2065C74.1725 25.498 73.2232 26.4804 72.031 27.1648C70.8389 27.8492 69.4922 28.1803 68.0021 28.1803C66.5008 28.1803 65.1542 27.8381 63.962 27.1538C62.7699 26.4694 61.8206 25.487 61.1362 24.1955C60.4408 22.904 60.0986 21.3366 60.0986 19.5042C60.0986 17.6608 60.4408 16.0934 61.1362 14.8019C61.8316 13.5104 62.7699 12.528 63.962 11.8436C65.1542 11.1593 66.5008 10.8281 68.0021 10.8281C69.4922 10.8281 70.8389 11.1703 72.031 11.8436C73.2232 12.528 74.1725 13.5104 74.8679 14.8019C75.5743 16.0934 75.9165 17.6608 75.9165 19.5042ZM72.2959 19.5042C72.2959 18.3121 72.1193 17.3076 71.7661 16.4797C71.4129 15.6629 70.9162 15.0337 70.2649 14.6143C69.6247 14.1948 68.863 13.974 68.0021 13.974C67.1411 13.974 66.3794 14.1838 65.7392 14.6143C65.099 15.0337 64.5912 15.6629 64.238 16.4797C63.8848 17.2966 63.7082 18.301 63.7082 19.5042C63.7082 20.6964 63.8848 21.7008 64.238 22.5287C64.5912 23.3455 65.0879 23.9747 65.7392 24.3942C66.3794 24.8136 67.1411 25.0344 68.0021 25.0344C68.863 25.0344 69.6247 24.8247 70.2649 24.3942C70.9051 23.9747 71.4129 23.3455 71.7661 22.5287C72.1193 21.7008 72.2959 20.6964 72.2959 19.5042Z" fill="#27BEC2" />
                            <path d="M85.5308 27.9485V11.0488H89.1072V25.0012H96.3483V27.9485H85.5308Z" fill="#27BEC2" />
                            <path d="M111.681 27.9485H105.687V11.0488H111.725C113.425 11.0488 114.893 11.391 116.118 12.0644C117.343 12.7377 118.293 13.7091 118.955 14.9674C119.617 16.2258 119.948 17.738 119.948 19.4931C119.948 21.2482 119.617 22.7715 118.955 24.0299C118.293 25.2993 117.343 26.2706 116.107 26.944C114.871 27.6173 113.392 27.9485 111.681 27.9485ZM109.263 24.8908H111.537C112.597 24.8908 113.48 24.7032 114.209 24.3279C114.937 23.9526 115.478 23.3676 115.842 22.5728C116.207 21.778 116.394 20.7515 116.394 19.4931C116.394 18.2458 116.207 17.2192 115.842 16.4355C115.478 15.6408 114.937 15.0557 114.209 14.6915C113.491 14.3162 112.597 14.1285 111.548 14.1285H109.263V24.8908Z" fill="#27BEC2" />
                            <path d="M145.083 19.5042C145.083 21.3476 144.729 22.9151 144.034 24.2065C143.338 25.498 142.389 26.4804 141.197 27.1648C140.005 27.8492 138.658 28.1803 137.168 28.1803C135.667 28.1803 134.32 27.8381 133.128 27.1538C131.936 26.4694 130.987 25.487 130.302 24.1955C129.607 22.904 129.265 21.3366 129.265 19.5042C129.265 17.6608 129.607 16.0934 130.302 14.8019C130.998 13.5104 131.936 12.528 133.128 11.8436C134.32 11.1593 135.667 10.8281 137.168 10.8281C138.658 10.8281 140.005 11.1703 141.197 11.8436C142.389 12.528 143.338 13.5104 144.034 14.8019C144.74 16.0934 145.083 17.6608 145.083 19.5042ZM141.462 19.5042C141.462 18.3121 141.285 17.3076 140.932 16.4797C140.579 15.6629 140.082 15.0337 139.431 14.6143C138.791 14.1948 138.029 13.974 137.168 13.974C136.307 13.974 135.545 14.1838 134.905 14.6143C134.265 15.0337 133.757 15.6629 133.404 16.4797C133.051 17.2966 132.874 18.301 132.874 19.5042C132.874 20.6964 133.051 21.7008 133.404 22.5287C133.757 23.3455 134.254 23.9747 134.905 24.3942C135.545 24.8136 136.307 25.0344 137.168 25.0344C138.029 25.0344 138.791 24.8247 139.431 24.3942C140.071 23.9747 140.579 23.3455 140.932 22.5287C141.285 21.7008 141.462 20.6964 141.462 19.5042Z" fill="#27BEC2" />
                            <path d="M13.4953 21.4474C14.9193 13.3895 19.2242 9.95656 19.2242 9.95656C13.5726 13.6765 12.3694 21.7565 12.3694 21.7565C9.32287 12.7051 16.5198 9.04038 19.2904 4.74648C18.2528 4.52572 17.1821 4.4043 16.0893 4.4043C7.75543 4.4043 1 11.1597 1 19.4936C1 27.7392 7.61193 34.4395 15.8134 34.583C9.58779 29.693 13.4953 21.4474 13.4953 21.4474ZM11.3208 25.9069C11.3208 25.9069 10.1618 20.7741 6.36461 18.6547C6.36461 18.6547 9.27872 20.6527 10.5812 25.7634C9.02484 25.377 5.43739 24.1076 4.37772 20.3325C3.7375 18.0807 4.17903 15.7848 5.3822 13.9745C6.35357 17.3964 13.109 18.9969 11.3208 25.9069Z" fill="#27BEC2" />
                            <path d="M23.8384 6.55718C23.0216 4.13979 20.2289 2.60547 20.2289 2.60547C22.3041 5.2657 23.2423 8.78691 22.5028 12.3412C21.8184 15.6748 19.8205 17.8935 17.7784 19.3285C15.3389 21.0504 13.7384 23.7217 13.5066 26.691C13.1754 30.8524 15.1954 33.7003 15.946 34.6055C15.9902 34.6055 16.0343 34.6055 16.0895 34.6055C24.4234 34.6055 31.1789 27.85 31.1789 19.5161C31.1789 14.008 28.2317 9.19533 23.8384 6.55718ZM24.5228 24.0418C22.9443 29.3402 17.8557 31.0622 15.648 31.5699C17.5797 24.3951 21.7411 21.6355 21.7411 21.6355C16.3324 24.5496 14.5994 31.7686 14.5994 31.7686C12.2372 21.9666 21.7963 19.8583 23.2423 15.0567C24.8981 17.6286 25.4721 20.8849 24.5228 24.0418Z" fill="#F08F77" />
                            <path d="M38.4091 32.426V38.2441H37.7045V32.426H38.4091ZM40.4013 35.6191V38.2441H39.7308V33.8805H40.3786V34.5623H40.4354C40.5376 34.3407 40.6929 34.1627 40.9013 34.0282C41.1096 33.8919 41.3786 33.8237 41.7081 33.8237C42.0036 33.8237 42.2621 33.8843 42.4837 34.0055C42.7053 34.1248 42.8776 34.3066 43.0007 34.551C43.1238 34.7934 43.1854 35.1002 43.1854 35.4714V38.2441H42.5149V35.5169C42.5149 35.1741 42.4259 34.907 42.2479 34.7157C42.0698 34.5225 41.8255 34.426 41.5149 34.426C41.3009 34.426 41.1096 34.4724 40.9411 34.5652C40.7744 34.658 40.6428 34.7934 40.5462 34.9714C40.4496 35.1494 40.4013 35.3654 40.4013 35.6191ZM46.3082 33.8805V34.4487H44.0469V33.8805H46.3082ZM44.706 32.835H45.3764V36.9941C45.3764 37.1835 45.4039 37.3256 45.4588 37.4203C45.5156 37.5131 45.5876 37.5756 45.6747 37.6078C45.7637 37.6381 45.8575 37.6532 45.956 37.6532C46.0298 37.6532 46.0904 37.6494 46.1378 37.6419C46.1851 37.6324 46.223 37.6248 46.2514 37.6191L46.3878 38.2214C46.3423 38.2385 46.2789 38.2555 46.1974 38.2725C46.116 38.2915 46.0128 38.301 45.8878 38.301C45.6984 38.301 45.5128 38.2602 45.331 38.1788C45.151 38.0974 45.0014 37.9733 44.8821 37.8066C44.7647 37.64 44.706 37.4297 44.706 37.176V32.835ZM49.0994 38.335C48.679 38.335 48.3163 38.2422 48.0114 38.0566C47.7083 37.8691 47.4744 37.6078 47.3097 37.2725C47.1468 36.9354 47.0653 36.5434 47.0653 36.0964C47.0653 35.6494 47.1468 35.2555 47.3097 34.9146C47.4744 34.5718 47.7036 34.3047 47.9972 34.1135C48.2926 33.9203 48.6373 33.8237 49.0312 33.8237C49.2585 33.8237 49.483 33.8616 49.7045 33.9373C49.9261 34.0131 50.1278 34.1362 50.3097 34.3066C50.4915 34.4752 50.6364 34.6987 50.7443 34.9771C50.8523 35.2555 50.9062 35.5983 50.9062 36.0055V36.2896H47.5426V35.71H50.2244C50.2244 35.4638 50.1752 35.2441 50.0767 35.051C49.9801 34.8578 49.8419 34.7053 49.6619 34.5936C49.4839 34.4818 49.2737 34.426 49.0312 34.426C48.7642 34.426 48.5331 34.4922 48.3381 34.6248C48.1449 34.7555 47.9962 34.926 47.892 35.1362C47.7879 35.3464 47.7358 35.5718 47.7358 35.8123V36.1987C47.7358 36.5282 47.7926 36.8076 47.9062 37.0368C48.0218 37.264 48.1818 37.4373 48.3864 37.5566C48.5909 37.6741 48.8286 37.7328 49.0994 37.7328C49.2756 37.7328 49.4347 37.7082 49.5767 37.6589C49.7206 37.6078 49.8447 37.532 49.9489 37.4316C50.053 37.3294 50.1335 37.2025 50.1903 37.051L50.8381 37.2328C50.7699 37.4525 50.6553 37.6457 50.4943 37.8123C50.3333 37.9771 50.1345 38.1059 49.8977 38.1987C49.661 38.2896 49.3949 38.335 49.0994 38.335ZM51.9261 38.2441V33.8805H52.5739V34.5396H52.6193C52.6989 34.3237 52.8428 34.1485 53.0511 34.014C53.2595 33.8796 53.4943 33.8123 53.7557 33.8123C53.8049 33.8123 53.8665 33.8133 53.9403 33.8152C54.0142 33.8171 54.0701 33.8199 54.108 33.8237V34.5055C54.0852 34.4998 54.0331 34.4913 53.9517 34.4799C53.8722 34.4667 53.7879 34.46 53.6989 34.46C53.4867 34.46 53.2973 34.5046 53.1307 34.5936C52.9659 34.6807 52.8352 34.8019 52.7386 34.9572C52.6439 35.1106 52.5966 35.2858 52.5966 35.4828V38.2441H51.9261ZM55.5732 35.6191V38.2441H54.9027V33.8805H55.5504V34.5623H55.6072C55.7095 34.3407 55.8648 34.1627 56.0732 34.0282C56.2815 33.8919 56.5504 33.8237 56.88 33.8237C57.1754 33.8237 57.4339 33.8843 57.6555 34.0055C57.8771 34.1248 58.0495 34.3066 58.1726 34.551C58.2957 34.7934 58.3572 35.1002 58.3572 35.4714V38.2441H57.6868V35.5169C57.6868 35.1741 57.5978 34.907 57.4197 34.7157C57.2417 34.5225 56.9974 34.426 56.6868 34.426C56.4728 34.426 56.2815 34.4724 56.1129 34.5652C55.9463 34.658 55.8146 34.7934 55.718 34.9714C55.6214 35.1494 55.5732 35.3654 55.5732 35.6191ZM61.4119 38.335C60.9915 38.335 60.6288 38.2422 60.3239 38.0566C60.0208 37.8691 59.7869 37.6078 59.6222 37.2725C59.4593 36.9354 59.3778 36.5434 59.3778 36.0964C59.3778 35.6494 59.4593 35.2555 59.6222 34.9146C59.7869 34.5718 60.0161 34.3047 60.3097 34.1135C60.6051 33.9203 60.9498 33.8237 61.3438 33.8237C61.571 33.8237 61.7955 33.8616 62.017 33.9373C62.2386 34.0131 62.4403 34.1362 62.6222 34.3066C62.804 34.4752 62.9489 34.6987 63.0568 34.9771C63.1648 35.2555 63.2188 35.5983 63.2188 36.0055V36.2896H59.8551V35.71H62.5369C62.5369 35.4638 62.4877 35.2441 62.3892 35.051C62.2926 34.8578 62.1544 34.7053 61.9744 34.5936C61.7964 34.4818 61.5862 34.426 61.3438 34.426C61.0767 34.426 60.8456 34.4922 60.6506 34.6248C60.4574 34.7555 60.3087 34.926 60.2045 35.1362C60.1004 35.3464 60.0483 35.5718 60.0483 35.8123V36.1987C60.0483 36.5282 60.1051 36.8076 60.2188 37.0368C60.3343 37.264 60.4943 37.4373 60.6989 37.5566C60.9034 37.6741 61.1411 37.7328 61.4119 37.7328C61.5881 37.7328 61.7472 37.7082 61.8892 37.6589C62.0331 37.6078 62.1572 37.532 62.2614 37.4316C62.3655 37.3294 62.446 37.2025 62.5028 37.051L63.1506 37.2328C63.0824 37.4525 62.9678 37.6457 62.8068 37.8123C62.6458 37.9771 62.447 38.1059 62.2102 38.1987C61.9735 38.2896 61.7074 38.335 61.4119 38.335ZM66.1364 33.8805V34.4487H63.875V33.8805H66.1364ZM64.5341 32.835H65.2045V36.9941C65.2045 37.1835 65.232 37.3256 65.2869 37.4203C65.3438 37.5131 65.4157 37.5756 65.5028 37.6078C65.5919 37.6381 65.6856 37.6532 65.7841 37.6532C65.858 37.6532 65.9186 37.6494 65.9659 37.6419C66.0133 37.6324 66.0511 37.6248 66.0795 37.6191L66.2159 38.2214C66.1705 38.2385 66.107 38.2555 66.0256 38.2725C65.9441 38.2915 65.8409 38.301 65.7159 38.301C65.5265 38.301 65.3409 38.2602 65.1591 38.1788C64.9792 38.0974 64.8295 37.9733 64.7102 37.8066C64.5928 37.64 64.5341 37.4297 64.5341 37.176V32.835ZM71.0426 38.335C70.679 38.335 70.358 38.2432 70.0795 38.0595C69.8011 37.8739 69.5833 37.6125 69.4261 37.2754C69.2689 36.9364 69.1903 36.5358 69.1903 36.0737C69.1903 35.6154 69.2689 35.2176 69.4261 34.8805C69.5833 34.5434 69.8021 34.283 70.0824 34.0993C70.3627 33.9155 70.6866 33.8237 71.054 33.8237C71.3381 33.8237 71.5625 33.871 71.7273 33.9657C71.8939 34.0585 72.0208 34.1646 72.108 34.2839C72.197 34.4013 72.2661 34.4979 72.3153 34.5737H72.3722V32.426H73.0426V38.2441H72.3949V37.5737H72.3153C72.2661 37.6532 72.196 37.7536 72.1051 37.8748C72.0142 37.9941 71.8845 38.1011 71.7159 38.1958C71.5473 38.2886 71.3229 38.335 71.0426 38.335ZM71.1335 37.7328C71.4025 37.7328 71.6297 37.6627 71.8153 37.5225C72.0009 37.3805 72.142 37.1845 72.2386 36.9345C72.3352 36.6826 72.3835 36.3919 72.3835 36.0623C72.3835 35.7366 72.3362 35.4515 72.2415 35.2072C72.1468 34.961 72.0066 34.7697 71.821 34.6333C71.6354 34.4951 71.4063 34.426 71.1335 34.426C70.8494 34.426 70.6127 34.4989 70.4233 34.6447C70.2358 34.7886 70.0947 34.9847 70 35.2328C69.9072 35.479 69.8608 35.7555 69.8608 36.0623C69.8608 36.3729 69.9081 36.6551 70.0028 36.9089C70.0994 37.1608 70.2415 37.3616 70.429 37.5112C70.6184 37.6589 70.8532 37.7328 71.1335 37.7328ZM76.1932 38.335C75.7727 38.335 75.41 38.2422 75.1051 38.0566C74.8021 37.8691 74.5682 37.6078 74.4034 37.2725C74.2405 36.9354 74.1591 36.5434 74.1591 36.0964C74.1591 35.6494 74.2405 35.2555 74.4034 34.9146C74.5682 34.5718 74.7973 34.3047 75.0909 34.1135C75.3864 33.9203 75.7311 33.8237 76.125 33.8237C76.3523 33.8237 76.5767 33.8616 76.7983 33.9373C77.0199 34.0131 77.2216 34.1362 77.4034 34.3066C77.5852 34.4752 77.7301 34.6987 77.8381 34.9771C77.946 35.2555 78 35.5983 78 36.0055V36.2896H74.6364V35.71H77.3182C77.3182 35.4638 77.2689 35.2441 77.1705 35.051C77.0739 34.8578 76.9356 34.7053 76.7557 34.5936C76.5777 34.4818 76.3674 34.426 76.125 34.426C75.858 34.426 75.6269 34.4922 75.4318 34.6248C75.2386 34.7555 75.09 34.926 74.9858 35.1362C74.8816 35.3464 74.8295 35.5718 74.8295 35.8123V36.1987C74.8295 36.5282 74.8864 36.8076 75 37.0368C75.1155 37.264 75.2756 37.4373 75.4801 37.5566C75.6847 37.6741 75.9223 37.7328 76.1932 37.7328C76.3693 37.7328 76.5284 37.7082 76.6705 37.6589C76.8144 37.6078 76.9384 37.532 77.0426 37.4316C77.1468 37.3294 77.2273 37.2025 77.2841 37.051L77.9318 37.2328C77.8636 37.4525 77.7491 37.6457 77.5881 37.8123C77.4271 37.9771 77.2282 38.1059 76.9915 38.1987C76.7547 38.2896 76.4886 38.335 76.1932 38.335ZM81.9403 32.426V38.2441H81.2699V32.426H81.9403ZM84.4524 38.3464C84.1759 38.3464 83.925 38.2943 83.6996 38.1902C83.4742 38.0841 83.2952 37.9316 83.1626 37.7328C83.0301 37.532 82.9638 37.2896 82.9638 37.0055C82.9638 36.7555 83.013 36.5529 83.1115 36.3975C83.21 36.2404 83.3416 36.1172 83.5064 36.0282C83.6712 35.9392 83.853 35.8729 84.0518 35.8294C84.2526 35.7839 84.4543 35.7479 84.657 35.7214C84.9221 35.6873 85.1371 35.6618 85.3018 35.6447C85.4685 35.6258 85.5897 35.5945 85.6655 35.551C85.7431 35.5074 85.782 35.4316 85.782 35.3237V35.301C85.782 35.0207 85.7053 34.8029 85.5518 34.6475C85.4003 34.4922 85.1702 34.4146 84.8615 34.4146C84.5414 34.4146 84.2905 34.4847 84.1087 34.6248C83.9268 34.765 83.799 34.9146 83.7251 35.0737L83.0888 34.8464C83.2024 34.5813 83.3539 34.3748 83.5433 34.2271C83.7346 34.0775 83.9429 33.9733 84.1683 33.9146C84.3956 33.854 84.6191 33.8237 84.8388 33.8237C84.9789 33.8237 85.1399 33.8407 85.3217 33.8748C85.5054 33.907 85.6825 33.9743 85.853 34.0765C86.0253 34.1788 86.1683 34.3332 86.282 34.5396C86.3956 34.746 86.4524 35.0225 86.4524 35.3691V38.2441H85.782V37.6532H85.7479C85.7024 37.7479 85.6267 37.8493 85.5206 37.9572C85.4145 38.0652 85.2734 38.157 85.0973 38.2328C84.9212 38.3085 84.7062 38.3464 84.4524 38.3464ZM84.5547 37.7441C84.8198 37.7441 85.0433 37.6921 85.2251 37.5879C85.4089 37.4837 85.5471 37.3493 85.6399 37.1845C85.7346 37.0197 85.782 36.8464 85.782 36.6646V36.051C85.7536 36.085 85.6911 36.1163 85.5945 36.1447C85.4998 36.1712 85.3899 36.1949 85.2649 36.2157C85.1418 36.2347 85.0215 36.2517 84.9041 36.2669C84.7886 36.2801 84.6948 36.2915 84.6229 36.301C84.4486 36.3237 84.2857 36.3606 84.1342 36.4118C83.9846 36.461 83.8634 36.5358 83.7706 36.6362C83.6797 36.7347 83.6342 36.8691 83.6342 37.0396C83.6342 37.2725 83.7204 37.4487 83.8928 37.568C84.067 37.6854 84.2876 37.7441 84.5547 37.7441ZM90.767 34.8578L90.1648 35.0282C90.1269 34.9279 90.071 34.8303 89.9972 34.7356C89.9252 34.639 89.8267 34.5595 89.7017 34.497C89.5767 34.4345 89.4167 34.4032 89.2216 34.4032C88.9545 34.4032 88.732 34.4648 88.554 34.5879C88.3778 34.7091 88.2898 34.8635 88.2898 35.051C88.2898 35.2176 88.3504 35.3493 88.4716 35.4458C88.5928 35.5424 88.7822 35.6229 89.0398 35.6873L89.6875 35.8464C90.0777 35.9411 90.3684 36.086 90.5597 36.2811C90.7509 36.4743 90.8466 36.7233 90.8466 37.0282C90.8466 37.2782 90.7746 37.5017 90.6307 37.6987C90.4886 37.8957 90.2898 38.051 90.0341 38.1646C89.7784 38.2782 89.4811 38.335 89.142 38.335C88.697 38.335 88.3286 38.2385 88.0369 38.0453C87.7453 37.8521 87.5606 37.5699 87.483 37.1987L88.1193 37.0396C88.1799 37.2744 88.2945 37.4506 88.4631 37.568C88.6335 37.6854 88.8561 37.7441 89.1307 37.7441C89.4432 37.7441 89.6913 37.6779 89.875 37.5453C90.0606 37.4108 90.1534 37.2498 90.1534 37.0623C90.1534 36.9108 90.1004 36.7839 89.9943 36.6816C89.8883 36.5775 89.7254 36.4998 89.5057 36.4487L88.7784 36.2782C88.3788 36.1835 88.0852 36.0368 87.8977 35.8379C87.7121 35.6371 87.6193 35.3862 87.6193 35.085C87.6193 34.8388 87.6884 34.621 87.8267 34.4316C87.9669 34.2422 88.1572 34.0936 88.3977 33.9856C88.6402 33.8777 88.9148 33.8237 89.2216 33.8237C89.6534 33.8237 89.9924 33.9184 90.2386 34.1078C90.4867 34.2972 90.6629 34.5472 90.767 34.8578ZM98.8786 34.2441H98.174C98.1323 34.0415 98.0594 33.8635 97.9553 33.71C97.853 33.5566 97.728 33.4279 97.5803 33.3237C97.4344 33.2176 97.2725 33.1381 97.0945 33.085C96.9164 33.032 96.7308 33.0055 96.5376 33.0055C96.1854 33.0055 95.8662 33.0945 95.5803 33.2725C95.2962 33.4506 95.0698 33.7129 94.9013 34.0595C94.7346 34.4061 94.6513 34.8313 94.6513 35.335C94.6513 35.8388 94.7346 36.264 94.9013 36.6106C95.0698 36.9572 95.2962 37.2195 95.5803 37.3975C95.8662 37.5756 96.1854 37.6646 96.5376 37.6646C96.7308 37.6646 96.9164 37.6381 97.0945 37.585C97.2725 37.532 97.4344 37.4534 97.5803 37.3493C97.728 37.2432 97.853 37.1135 97.9553 36.96C98.0594 36.8047 98.1323 36.6267 98.174 36.426H98.8786C98.8255 36.7233 98.7289 36.9894 98.5888 37.2243C98.4486 37.4591 98.2744 37.6589 98.0661 37.8237C97.8577 37.9866 97.6238 38.1106 97.3643 38.1958C97.1068 38.2811 96.8312 38.3237 96.5376 38.3237C96.0414 38.3237 95.6001 38.2025 95.2138 37.96C94.8274 37.7176 94.5234 37.3729 94.3018 36.926C94.0803 36.479 93.9695 35.9487 93.9695 35.335C93.9695 34.7214 94.0803 34.1911 94.3018 33.7441C94.5234 33.2972 94.8274 32.9525 95.2138 32.71C95.6001 32.4676 96.0414 32.3464 96.5376 32.3464C96.8312 32.3464 97.1068 32.389 97.3643 32.4743C97.6238 32.5595 97.8577 32.6845 98.0661 32.8493C98.2744 33.0121 98.4486 33.211 98.5888 33.4458C98.7289 33.6788 98.8255 33.9449 98.8786 34.2441ZM101.699 38.335C101.305 38.335 100.959 38.2413 100.662 38.0538C100.366 37.8663 100.135 37.604 99.9688 37.2669C99.804 36.9297 99.7216 36.5358 99.7216 36.085C99.7216 35.6305 99.804 35.2337 99.9688 34.8947C100.135 34.5557 100.366 34.2924 100.662 34.1049C100.959 33.9174 101.305 33.8237 101.699 33.8237C102.093 33.8237 102.438 33.9174 102.733 34.1049C103.03 34.2924 103.261 34.5557 103.426 34.8947C103.593 35.2337 103.676 35.6305 103.676 36.085C103.676 36.5358 103.593 36.9297 103.426 37.2669C103.261 37.604 103.03 37.8663 102.733 38.0538C102.438 38.2413 102.093 38.335 101.699 38.335ZM101.699 37.7328C101.998 37.7328 102.244 37.6561 102.438 37.5027C102.631 37.3493 102.774 37.1475 102.866 36.8975C102.959 36.6475 103.006 36.3767 103.006 36.085C103.006 35.7934 102.959 35.5216 102.866 35.2697C102.774 35.0178 102.631 34.8142 102.438 34.6589C102.244 34.5036 101.998 34.426 101.699 34.426C101.4 34.426 101.153 34.5036 100.96 34.6589C100.767 34.8142 100.624 35.0178 100.531 35.2697C100.438 35.5216 100.392 35.7934 100.392 36.085C100.392 36.3767 100.438 36.6475 100.531 36.8975C100.624 37.1475 100.767 37.3493 100.96 37.5027C101.153 37.6561 101.4 37.7328 101.699 37.7328ZM107.79 34.8578L107.188 35.0282C107.15 34.9279 107.094 34.8303 107.021 34.7356C106.949 34.639 106.85 34.5595 106.725 34.497C106.6 34.4345 106.44 34.4032 106.245 34.4032C105.978 34.4032 105.755 34.4648 105.577 34.5879C105.401 34.7091 105.313 34.8635 105.313 35.051C105.313 35.2176 105.374 35.3493 105.495 35.4458C105.616 35.5424 105.806 35.6229 106.063 35.6873L106.711 35.8464C107.101 35.9411 107.392 36.086 107.583 36.2811C107.774 36.4743 107.87 36.7233 107.87 37.0282C107.87 37.2782 107.798 37.5017 107.654 37.6987C107.512 37.8957 107.313 38.051 107.058 38.1646C106.802 38.2782 106.504 38.335 106.165 38.335C105.72 38.335 105.352 38.2385 105.06 38.0453C104.769 37.8521 104.584 37.5699 104.506 37.1987L105.143 37.0396C105.203 37.2744 105.318 37.4506 105.487 37.568C105.657 37.6854 105.879 37.7441 106.154 37.7441C106.467 37.7441 106.715 37.6779 106.898 37.5453C107.084 37.4108 107.177 37.2498 107.177 37.0623C107.177 36.9108 107.124 36.7839 107.018 36.6816C106.912 36.5775 106.749 36.4998 106.529 36.4487L105.802 36.2782C105.402 36.1835 105.109 36.0368 104.921 35.8379C104.736 35.6371 104.643 35.3862 104.643 35.085C104.643 34.8388 104.712 34.621 104.85 34.4316C104.99 34.2422 105.181 34.0936 105.421 33.9856C105.664 33.8777 105.938 33.8237 106.245 33.8237C106.677 33.8237 107.016 33.9184 107.262 34.1078C107.51 34.2972 107.686 34.5472 107.79 34.8578ZM110.163 38.3464C109.887 38.3464 109.636 38.2943 109.411 38.1902C109.185 38.0841 109.006 37.9316 108.874 37.7328C108.741 37.532 108.675 37.2896 108.675 37.0055C108.675 36.7555 108.724 36.5529 108.822 36.3975C108.921 36.2404 109.053 36.1172 109.217 36.0282C109.382 35.9392 109.564 35.8729 109.763 35.8294C109.964 35.7839 110.165 35.7479 110.368 35.7214C110.633 35.6873 110.848 35.6618 111.013 35.6447C111.179 35.6258 111.301 35.5945 111.376 35.551C111.454 35.5074 111.493 35.4316 111.493 35.3237V35.301C111.493 35.0207 111.416 34.8029 111.263 34.6475C111.111 34.4922 110.881 34.4146 110.572 34.4146C110.252 34.4146 110.001 34.4847 109.82 34.6248C109.638 34.765 109.51 34.9146 109.436 35.0737L108.8 34.8464C108.913 34.5813 109.065 34.3748 109.254 34.2271C109.446 34.0775 109.654 33.9733 109.879 33.9146C110.107 33.854 110.33 33.8237 110.55 33.8237C110.69 33.8237 110.851 33.8407 111.033 33.8748C111.216 33.907 111.393 33.9743 111.564 34.0765C111.736 34.1788 111.879 34.3332 111.993 34.5396C112.107 34.746 112.163 35.0225 112.163 35.3691V38.2441H111.493V37.6532H111.459C111.413 37.7479 111.338 37.8493 111.232 37.9572C111.125 38.0652 110.984 38.157 110.808 38.2328C110.632 38.3085 110.417 38.3464 110.163 38.3464ZM110.266 37.7441C110.531 37.7441 110.754 37.6921 110.936 37.5879C111.12 37.4837 111.258 37.3493 111.351 37.1845C111.446 37.0197 111.493 36.8464 111.493 36.6646V36.051C111.464 36.085 111.402 36.1163 111.305 36.1447C111.211 36.1712 111.101 36.1949 110.976 36.2157C110.853 36.2347 110.732 36.2517 110.615 36.2669C110.5 36.2801 110.406 36.2915 110.334 36.301C110.16 36.3237 109.997 36.3606 109.845 36.4118C109.696 36.461 109.574 36.5358 109.482 36.6362C109.391 36.7347 109.345 36.8691 109.345 37.0396C109.345 37.2725 109.431 37.4487 109.604 37.568C109.778 37.6854 109.999 37.7441 110.266 37.7441ZM116.478 34.8578L115.876 35.0282C115.838 34.9279 115.782 34.8303 115.708 34.7356C115.636 34.639 115.538 34.5595 115.413 34.497C115.288 34.4345 115.128 34.4032 114.933 34.4032C114.665 34.4032 114.443 34.4648 114.265 34.5879C114.089 34.7091 114.001 34.8635 114.001 35.051C114.001 35.2176 114.061 35.3493 114.183 35.4458C114.304 35.5424 114.493 35.6229 114.751 35.6873L115.398 35.8464C115.789 35.9411 116.079 36.086 116.271 36.2811C116.462 36.4743 116.558 36.7233 116.558 37.0282C116.558 37.2782 116.486 37.5017 116.342 37.6987C116.2 37.8957 116.001 38.051 115.745 38.1646C115.489 38.2782 115.192 38.335 114.853 38.335C114.408 38.335 114.04 38.2385 113.748 38.0453C113.456 37.8521 113.272 37.5699 113.194 37.1987L113.83 37.0396C113.891 37.2744 114.005 37.4506 114.174 37.568C114.344 37.6854 114.567 37.7441 114.842 37.7441C115.154 37.7441 115.402 37.6779 115.586 37.5453C115.772 37.4108 115.864 37.2498 115.864 37.0623C115.864 36.9108 115.811 36.7839 115.705 36.6816C115.599 36.5775 115.436 36.4998 115.217 36.4487L114.489 36.2782C114.09 36.1835 113.796 36.0368 113.609 35.8379C113.423 35.6371 113.33 35.3862 113.33 35.085C113.33 34.8388 113.399 34.621 113.538 34.4316C113.678 34.2422 113.868 34.0936 114.109 33.9856C114.351 33.8777 114.626 33.8237 114.933 33.8237C115.364 33.8237 115.703 33.9184 115.95 34.1078C116.198 34.2972 116.374 34.5472 116.478 34.8578ZM119.908 32.426H120.749L122.726 37.2555H122.794L124.771 32.426H125.612V38.2441H124.953V33.8237H124.896L123.078 38.2441H122.442L120.624 33.8237H120.567V38.2441H119.908V32.426ZM128.763 38.335C128.343 38.335 127.98 38.2422 127.675 38.0566C127.372 37.8691 127.138 37.6078 126.974 37.2725C126.811 36.9354 126.729 36.5434 126.729 36.0964C126.729 35.6494 126.811 35.2555 126.974 34.9146C127.138 34.5718 127.368 34.3047 127.661 34.1135C127.957 33.9203 128.301 33.8237 128.695 33.8237C128.923 33.8237 129.147 33.8616 129.369 33.9373C129.59 34.0131 129.792 34.1362 129.974 34.3066C130.156 34.4752 130.3 34.6987 130.408 34.9771C130.516 35.2555 130.57 35.5983 130.57 36.0055V36.2896H127.207V35.71H129.888C129.888 35.4638 129.839 35.2441 129.741 35.051C129.644 34.8578 129.506 34.7053 129.326 34.5936C129.148 34.4818 128.938 34.426 128.695 34.426C128.428 34.426 128.197 34.4922 128.002 34.6248C127.809 34.7555 127.66 34.926 127.556 35.1362C127.452 35.3464 127.4 35.5718 127.4 35.8123V36.1987C127.4 36.5282 127.457 36.8076 127.57 37.0368C127.686 37.264 127.846 37.4373 128.05 37.5566C128.255 37.6741 128.493 37.7328 128.763 37.7328C128.94 37.7328 129.099 37.7082 129.241 37.6589C129.385 37.6078 129.509 37.532 129.613 37.4316C129.717 37.3294 129.798 37.2025 129.854 37.051L130.502 37.2328C130.434 37.4525 130.319 37.6457 130.158 37.8123C129.997 37.9771 129.799 38.1059 129.562 38.1987C129.325 38.2896 129.059 38.335 128.763 38.335ZM128.354 33.2896L129.048 31.9714H129.832L128.945 33.2896H128.354ZM133.238 38.335C132.874 38.335 132.553 38.2432 132.275 38.0595C131.996 37.8739 131.779 37.6125 131.621 37.2754C131.464 36.9364 131.386 36.5358 131.386 36.0737C131.386 35.6154 131.464 35.2176 131.621 34.8805C131.779 34.5434 131.997 34.283 132.278 34.0993C132.558 33.9155 132.882 33.8237 133.249 33.8237C133.533 33.8237 133.758 33.871 133.923 33.9657C134.089 34.0585 134.216 34.1646 134.303 34.2839C134.392 34.4013 134.461 34.4979 134.511 34.5737H134.567V32.426H135.238V38.2441H134.59V37.5737H134.511C134.461 37.6532 134.391 37.7536 134.3 37.8748C134.21 37.9941 134.08 38.1011 133.911 38.1958C133.743 38.2886 133.518 38.335 133.238 38.335ZM133.329 37.7328C133.598 37.7328 133.825 37.6627 134.011 37.5225C134.196 37.3805 134.337 37.1845 134.434 36.9345C134.531 36.6826 134.579 36.3919 134.579 36.0623C134.579 35.7366 134.531 35.4515 134.437 35.2072C134.342 34.961 134.202 34.7697 134.016 34.6333C133.831 34.4951 133.602 34.426 133.329 34.426C133.045 34.426 132.808 34.4989 132.619 34.6447C132.431 34.7886 132.29 34.9847 132.195 35.2328C132.103 35.479 132.056 35.7555 132.056 36.0623C132.056 36.3729 132.103 36.6551 132.198 36.9089C132.295 37.1608 132.437 37.3616 132.624 37.5112C132.814 37.6589 133.049 37.7328 133.329 37.7328ZM136.559 38.2441V33.8805H137.229V38.2441H136.559ZM136.9 33.1532C136.769 33.1532 136.656 33.1087 136.562 33.0197C136.469 32.9307 136.423 32.8237 136.423 32.6987C136.423 32.5737 136.469 32.4667 136.562 32.3777C136.656 32.2886 136.769 32.2441 136.9 32.2441C137.031 32.2441 137.142 32.2886 137.235 32.3777C137.33 32.4667 137.377 32.5737 137.377 32.6987C137.377 32.8237 137.33 32.9307 137.235 33.0197C137.142 33.1087 137.031 33.1532 136.9 33.1532ZM140.23 38.335C139.821 38.335 139.469 38.2385 139.173 38.0453C138.878 37.8521 138.651 37.586 138.491 37.247C138.332 36.908 138.253 36.5207 138.253 36.085C138.253 35.6419 138.334 35.2508 138.497 34.9118C138.662 34.5708 138.891 34.3047 139.185 34.1135C139.48 33.9203 139.825 33.8237 140.219 33.8237C140.526 33.8237 140.802 33.8805 141.048 33.9941C141.295 34.1078 141.496 34.2669 141.653 34.4714C141.811 34.676 141.908 34.9146 141.946 35.1873H141.276C141.224 34.9885 141.111 34.8123 140.935 34.6589C140.76 34.5036 140.526 34.426 140.23 34.426C139.969 34.426 139.74 34.4941 139.543 34.6305C139.348 34.765 139.195 34.9553 139.085 35.2015C138.977 35.4458 138.923 35.7328 138.923 36.0623C138.923 36.3994 138.976 36.693 139.082 36.943C139.19 37.193 139.342 37.3871 139.537 37.5254C139.734 37.6636 139.965 37.7328 140.23 37.7328C140.404 37.7328 140.562 37.7025 140.705 37.6419C140.847 37.5813 140.967 37.4941 141.065 37.3805C141.164 37.2669 141.234 37.1305 141.276 36.9714H141.946C141.908 37.229 141.814 37.461 141.665 37.6674C141.517 37.872 141.321 38.0349 141.077 38.1561C140.834 38.2754 140.552 38.335 140.23 38.335ZM144.21 38.3464C143.934 38.3464 143.683 38.2943 143.457 38.1902C143.232 38.0841 143.053 37.9316 142.92 37.7328C142.788 37.532 142.722 37.2896 142.722 37.0055C142.722 36.7555 142.771 36.5529 142.869 36.3975C142.968 36.2404 143.099 36.1172 143.264 36.0282C143.429 35.9392 143.611 35.8729 143.81 35.8294C144.01 35.7839 144.212 35.7479 144.415 35.7214C144.68 35.6873 144.895 35.6618 145.06 35.6447C145.226 35.6258 145.348 35.5945 145.423 35.551C145.501 35.5074 145.54 35.4316 145.54 35.3237V35.301C145.54 35.0207 145.463 34.8029 145.31 34.6475C145.158 34.4922 144.928 34.4146 144.619 34.4146C144.299 34.4146 144.048 34.4847 143.866 34.6248C143.685 34.765 143.557 34.9146 143.483 35.0737L142.847 34.8464C142.96 34.5813 143.112 34.3748 143.301 34.2271C143.492 34.0775 143.701 33.9733 143.926 33.9146C144.153 33.854 144.377 33.8237 144.597 33.8237C144.737 33.8237 144.898 33.8407 145.08 33.8748C145.263 33.907 145.44 33.9743 145.611 34.0765C145.783 34.1788 145.926 34.3332 146.04 34.5396C146.153 34.746 146.21 35.0225 146.21 35.3691V38.2441H145.54V37.6532H145.506C145.46 37.7479 145.384 37.8493 145.278 37.9572C145.172 38.0652 145.031 38.157 144.855 38.2328C144.679 38.3085 144.464 38.3464 144.21 38.3464ZM144.312 37.7441C144.578 37.7441 144.801 37.6921 144.983 37.5879C145.167 37.4837 145.305 37.3493 145.398 37.1845C145.492 37.0197 145.54 36.8464 145.54 36.6646V36.051C145.511 36.085 145.449 36.1163 145.352 36.1447C145.258 36.1712 145.148 36.1949 145.023 36.2157C144.9 36.2347 144.779 36.2517 144.662 36.2669C144.546 36.2801 144.453 36.2915 144.381 36.301C144.206 36.3237 144.044 36.3606 143.892 36.4118C143.742 36.461 143.621 36.5358 143.528 36.6362C143.438 36.7347 143.392 36.8691 143.392 37.0396C143.392 37.2725 143.478 37.4487 143.651 37.568C143.825 37.6854 144.045 37.7441 144.312 37.7441ZM150.525 34.8578L149.923 35.0282C149.885 34.9279 149.829 34.8303 149.755 34.7356C149.683 34.639 149.585 34.5595 149.46 34.497C149.335 34.4345 149.174 34.4032 148.979 34.4032C148.712 34.4032 148.49 34.4648 148.312 34.5879C148.136 34.7091 148.048 34.8635 148.048 35.051C148.048 35.2176 148.108 35.3493 148.229 35.4458C148.351 35.5424 148.54 35.6229 148.798 35.6873L149.445 35.8464C149.835 35.9411 150.126 36.086 150.317 36.2811C150.509 36.4743 150.604 36.7233 150.604 37.0282C150.604 37.2782 150.532 37.5017 150.388 37.6987C150.246 37.8957 150.048 38.051 149.792 38.1646C149.536 38.2782 149.239 38.335 148.9 38.335C148.455 38.335 148.086 38.2385 147.795 38.0453C147.503 37.8521 147.318 37.5699 147.241 37.1987L147.877 37.0396C147.938 37.2744 148.052 37.4506 148.221 37.568C148.391 37.6854 148.614 37.7441 148.888 37.7441C149.201 37.7441 149.449 37.6779 149.633 37.5453C149.818 37.4108 149.911 37.2498 149.911 37.0623C149.911 36.9108 149.858 36.7839 149.752 36.6816C149.646 36.5775 149.483 36.4998 149.263 36.4487L148.536 36.2782C148.137 36.1835 147.843 36.0368 147.656 35.8379C147.47 35.6371 147.377 35.3862 147.377 35.085C147.377 34.8388 147.446 34.621 147.585 34.4316C147.725 34.2422 147.915 34.0936 148.156 33.9856C148.398 33.8777 148.673 33.8237 148.979 33.8237C149.411 33.8237 149.75 33.9184 149.996 34.1078C150.245 34.2972 150.421 34.5472 150.525 34.8578Z" fill="#DF6D51" />
                            <rect x="151" y="8.60547" width="47" height="20" rx="10" fill="#FFFAF0" />
                            <path d="M161.114 13.8782V22.6055H160.057V13.8782H161.114ZM165.568 22.7418C165.022 22.7418 164.541 22.604 164.123 22.3285C163.706 22.0501 163.379 21.658 163.143 21.1523C162.907 20.6438 162.789 20.043 162.789 19.3498C162.789 18.6623 162.907 18.0657 163.143 17.56C163.379 17.0543 163.707 16.6637 164.127 16.3881C164.548 16.1126 165.034 15.9748 165.585 15.9748C166.011 15.9748 166.348 16.0458 166.595 16.1879C166.845 16.3271 167.035 16.4862 167.166 16.6651C167.299 16.8413 167.403 16.9862 167.477 17.0998H167.562V13.8782H168.568V22.6055H167.596V21.5998H167.477C167.403 21.7191 167.298 21.8697 167.162 22.0515C167.025 22.2305 166.831 22.391 166.578 22.533C166.325 22.6722 165.988 22.7418 165.568 22.7418ZM165.704 21.8384C166.108 21.8384 166.449 21.7333 166.727 21.5231C167.005 21.31 167.217 21.016 167.362 20.641C167.507 20.2631 167.579 19.8271 167.579 19.3327C167.579 18.8441 167.508 18.4165 167.366 18.0501C167.224 17.6808 167.014 17.3938 166.735 17.1893C166.457 16.9819 166.113 16.8782 165.704 16.8782C165.278 16.8782 164.923 16.9876 164.639 17.2063C164.358 17.4222 164.146 17.7163 164.004 18.0884C163.865 18.4577 163.795 18.8725 163.795 19.3327C163.795 19.7987 163.866 20.2219 164.008 20.6026C164.153 20.9805 164.366 21.2816 164.647 21.506C164.931 21.7276 165.284 21.8384 165.704 21.8384ZM177.708 16.6055H176.652C176.589 16.3015 176.48 16.0344 176.324 15.8043C176.17 15.5742 175.983 15.381 175.761 15.2248C175.542 15.0657 175.299 14.9464 175.032 14.8668C174.765 14.7873 174.487 14.7475 174.197 14.7475C173.669 14.7475 173.19 14.881 172.761 15.1481C172.335 15.4151 171.995 15.8086 171.743 16.3285C171.493 16.8484 171.368 17.4862 171.368 18.2418C171.368 18.9975 171.493 19.6353 171.743 20.1552C171.995 20.6751 172.335 21.0685 172.761 21.3356C173.19 21.6026 173.669 21.7362 174.197 21.7362C174.487 21.7362 174.765 21.6964 175.032 21.6168C175.299 21.5373 175.542 21.4194 175.761 21.2631C175.983 21.104 176.17 20.9094 176.324 20.6793C176.48 20.4464 176.589 20.1793 176.652 19.8782H177.708C177.629 20.3242 177.484 20.7234 177.274 21.0756C177.064 21.4279 176.802 21.7276 176.49 21.9748C176.177 22.2191 175.826 22.4052 175.437 22.533C175.051 22.6609 174.637 22.7248 174.197 22.7248C173.453 22.7248 172.791 22.543 172.211 22.1793C171.632 21.8157 171.176 21.2987 170.843 20.6282C170.511 19.9577 170.345 19.1623 170.345 18.2418C170.345 17.3214 170.511 16.5259 170.843 15.8555C171.176 15.185 171.632 14.668 172.211 14.3043C172.791 13.9407 173.453 13.7589 174.197 13.7589C174.637 13.7589 175.051 13.8228 175.437 13.9506C175.826 14.0785 176.177 14.266 176.49 14.5131C176.802 14.7575 177.064 15.0558 177.274 15.408C177.484 15.7575 177.629 16.1566 177.708 16.6055ZM179.416 13.8782H180.678L183.643 21.1225H183.746L186.712 13.8782H187.973V22.6055H186.984V15.9748H186.899L184.172 22.6055H183.217L180.49 15.9748H180.405V22.6055H179.416V13.8782Z" fill="#DF6D51" />
                        </svg>
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
                            <path d="M12.172 4.99968L5.58602 11.5857C5.395 11.7702 5.24264 11.9909 5.13782 12.2349C5.033 12.4789 4.97783 12.7413 4.97552 13.0069C4.97321 13.2724 5.02381 13.5358 5.12438 13.7816C5.22494 14.0274 5.37344 14.2507 5.56123 14.4385C5.74902 14.6263 5.97232 14.7748 6.21811 14.8753C6.4639 14.9759 6.72726 15.0265 6.99282 15.0242C7.25838 15.0219 7.52082 14.9667 7.76483 14.8619C8.00884 14.7571 8.22953 14.6047 8.41402 14.4137L14.828 7.82768C15.5567 7.07327 15.9598 6.06286 15.9507 5.01407C15.9416 3.96528 15.5209 2.96203 14.7793 2.2204C14.0377 1.47877 13.0344 1.05809 11.9856 1.04898C10.9368 1.03987 9.92643 1.44304 9.17202 2.17168L2.75702 8.75668C1.63171 9.88199 0.999512 11.4082 0.999512 12.9997C0.999512 14.5911 1.63171 16.1174 2.75702 17.2427C3.88233 18.368 5.40859 19.0002 7.00002 19.0002C8.59145 19.0002 10.1177 18.368 11.243 17.2427L17.5 10.9997" stroke="#364152" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                                    <section style={{ backgroundColor: '#F7FAFC' }} className="flex-shrink-0 rounded-full mb-3">
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
                                                    <path d="M1 13V14C1 14.7956 1.31607 15.5587 1.87868 16.1213C2.44129 16.6839 3.20435 17 4 17H14C14.7956 17 15.5587 16.6839 16.1213 16.1213C16.6839 15.5587 17 14.7956 17 14V13M13 9L9 13M9 13L5 9M9 13V1" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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

        var days_diff = -1;

        if (detail !== undefined) {
            const currentDate = moment(new Date());
            //@ts-ignore
            const returnDate = moment(detail.authoredDate);
            days_diff = currentDate.diff(returnDate, 'days');

        }

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
                                        days_diff < 0 ? 'día invalido' : days_diff === 0 ? 'Hoy' : days_diff === 1 ? 'Ayer' : 'Hace ' + days_diff + ' días'
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
                            {detail.studiesCodes.map((i) => (<li>{i.display}</li>))}
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
            <Provider>
                <div className="overflow-y-auto scrollbar" style={{ height: 'calc( 100vh - 220px)' }}>
                    <StudyOrder setShowMakeOrder={setIssueOrder} remoteMode={true}></StudyOrder>
                </div>
            </Provider>
        )
    }
}