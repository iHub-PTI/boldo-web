//TODO: remove everything after update
import axios from "axios"
import React, { useState, useEffect, ChangeEvent, forwardRef } from 'react'
import {
  Card,
  Divider,
  Grid,
  Typography,
  FormControl,
  MenuItem,
  Select
} from '@material-ui/core';
import { useRouteMatch } from "react-router-dom";
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import CloseIcon from '@material-ui/icons/Close';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddBox from '@material-ui/icons/AddBox';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from "material-table";
import { Icons } from 'material-table';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import moment from 'moment'
import { useToasts } from './Toast';
import Modal from "./Modal";
import { ReactComponent as OrderAdd } from "../assets/post-add.svg"
import { ReactComponent as NoResults } from "../assets/no-results-icon.svg"
import { ReactComponent as SpinnerLoading } from "../assets/spinner-loading.svg"
import { ReactComponent as OtherIcon } from "../assets/icon-other.svg"
import { ReactComponent as ImgIcon } from "../assets/img-icon.svg"
import { ReactComponent as LabIcon } from "../assets/laboratory-icon.svg"
import { ReactComponent as Calendar } from "../assets/calendar-detail.svg"
import { ReactComponent as PatientSource } from "../assets/svg-sources-studies/patient-source.svg"
import { ReactComponent as TesaiSource } from "../assets/svg-sources-studies/tesai-source.svg"
import { ReactComponent as VentrixSource } from "../assets/svg-sources-studies/ventrix-source.svg"
import { ReactComponent as WithoutSource } from "../assets/svg-sources-studies/without-origin.svg"
import StudyOrder from "./studiesorder/StudyOrder";
// import Provider from "./studiesorder/Provider";
import { TIME_TO_OPEN_APPOINTMENT, HEIGHT_NAVBAR, HEIGHT_BAR_STATE_APPOINTMENT, WIDTH_XL, ORGANIZATION_BAR } from "../util/constants";
import useWindowDimensions from "../util/useWindowDimensions";
import { countDays, toUpperLowerCase } from "../util/helpers";
import handleSendSentry from "../util/Sentry/sentryHelper";
import { ERROR_HEADERS } from "../util/Sentry/errorHeaders";


export function LaboratoryMenu(props) {
  const { addToast } = useToasts()
  const { appointment } = props;
  const [loading, setLoading] = useState(true)
  const [selectedRow, setSelectedRow] = useState()
  const [studiesData, setStudiesData] = useState<any>()
  const [studyDetail, setStudyDetail] = useState<any>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPreview, setShowPreview] = useState({})
  const [categorySelect, setCategory] = useState("")
  const [loadPreview, setLoadPreview] = useState(false)
  const [showMakeOrder, setShowMakeOrder] = useState(false)
  //toggle studies click event between studies issued(false) and realized studies(true)
  const [toggleStudies, setToggleStudies] = useState(true)
  const [issuedStudiesData, setIssuedStudiesData] = useState([])
  const [loadingIssued, setLoadingIssued] = useState(false)
  const [selectedRowIssued, setSelectedRowIssued] = useState(undefined)
  //disabled issuedOrder button
  const [disabledButton, setDisabledButton] = useState(true)
  //width 
  const { width } = useWindowDimensions()
  // Encounter handler
  let match = useRouteMatch<{ id: string }>('/appointments/:id/inperson/')
  const id = match?.params.id
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emptySoep, setEmptySoep] = useState(false)
  const [encounter, setEncounter] = useState<Boldo.Encounter>(undefined)

  const tableIcons: Icons = {
    SortArrow: forwardRef((props, ref) => <ArrowUpward style={{ color: "#13A5A9" }} {...props} ref={ref} />),
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  }

  useEffect(() => {
    const load = async () => {
      const url = `/profile/doctor/diagnosticReports?patient_id=${appointment.patientId}`
      try {
        setLoading(true)
        if (appointment !== undefined) {
            const res = await axios.get(url)
            setStudiesData(res.data.items)
            setLoading(false)
        }
      } catch (err) {
        const tags = {
          "endpoint": url,
          "method": 'GET',
          "appointment-id": appointment.id,
          "doctor-id": appointment.doctorId,
          "patient-id": appointment.patientId
        }
        handleSendSentry(err, ERROR_HEADERS.DIAGNOSTIC_REPORT.FAILURE_GET, tags)
        addToast({ 
          type: 'error', 
          title: 'Ha ocurrido un error.', 
          text: 'No pudimos obtener los estudios realizados. ¡Inténtelo nuevamente más tarde!' 
        })
        // setLoading(false)
        // console.log(err)
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


  useEffect(() => {
    const loadIssued = async () => {
    const url = `/profile/doctor/serviceRequests?patient_id=${appointment.patientId}`
    try {
      setLoadingIssued(true)
      if (appointment !== undefined) {
        setLoadingIssued(true)
        const res = await axios.get(url)
        // console.log("response issueds", res)
        if (res.status === 200)
          setIssuedStudiesData(res.data.items)
        if (res.status === 204)
          setIssuedStudiesData([])
        setLoadingIssued(false)
      }
    } catch (err) {
      const tags = {
        "endpoint": url,
        "method": 'GET',
        "appointment-id": appointment.id,
        "doctor-id": appointment.doctorId,
        "patient-id": appointment.patientId
      }
      handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET, tags)
      addToast({
        type: 'error',
        title: 'Ha ocurrido un error',
        text: 'No se pudieron cargar las órdenes de estudios. ¡Inténtelo nuevamente más tarde!'
      })
    } finally {
      setLoadingIssued(false)
    }
  }
  if (appointment && !showMakeOrder) 
    loadIssued()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMakeOrder, appointment])


  const downloadBlob = (url, title, contentType, download) => {
    var oReq = new XMLHttpRequest();
    setLoadPreview(true) //loading preview data modal
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
      setStudyDetail(undefined)
      try {
        if (selectedRow !== undefined) {
          //@ts-ignore
          const res = await axios.get(`/profile/doctor/diagnosticReport/${selectedRow.id}`)
          setStudyDetail(res.data)
        }
      } catch (err) {
        let tags = {}
        if (selectedRow) { 
          //@ts-ignore
          tags = {"endpoint": `/profile/doctor/diagnosticReport/${selectedRow.id}`}
        }
        tags = { ...tags, ...{"method": "GET"}}
        handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET_DESCRIPTION, tags)
        setSelectedRow(undefined)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error',
          text: 'No pudimos cargar la descripción del estudio. ¡Inténtelo nuevamente más tarde!'
        })
      } finally {
          // setInitialLoad(false)
      }
    }
    selectedRow !== undefined &&
        load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRow])

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
          const tags = {
            'endpoint': url,
            'method': 'GET',
            'appointment-id': appointment.id,
            "doctor-id": appointment.doctorId,
            "patient-id": appointment.patientId
          }
          handleSendSentry(err, ERROR_HEADERS.ENCOUNTER.FAILURE_GET, tags)
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
  }, [appointment])


  if (selectedRow)
    return laboratoryDetail()

  if (selectedRowIssued)
    return issuedDetail(selectedRowIssued)

  if (showMakeOrder)
    return (
      <>
        <div className="flex flex-row sm-max:mt-4">
          <button
            style={{ backgroundColor: '#27BEC2', height: '46px', width: '48px' }}
            className='flex items-center justify-center m-3 rounded-full focus:outline-none focus:bg-gray-600'
            onClick={() => {
              setShowMakeOrder(false);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7.0007H3.82998L8.70998 2.1207C9.09998 1.7307 9.09998 1.0907 8.70998 0.700703C8.31998 0.310703 7.68998 0.310703 7.29998 0.700703L0.70998 7.2907C0.31998 7.6807 0.31998 8.3107 0.70998 8.7007L7.29998 15.2907C7.68998 15.6807 8.31998 15.6807 8.70998 15.2907C9.09998 14.9007 9.09998 14.2707 8.70998 13.8807L3.82998 9.0007H15C15.55 9.0007 16 8.5507 16 8.0007C16 7.4507 15.55 7.0007 15 7.0007Z" fill="white" />
            </svg>
          </button>
          <div id="study_orders" className="flex flex-col flex-no-wrap flex-1 w-full" style={{
            height: ` ${width >= WIDTH_XL
                ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)`
                : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
              }`,
            overflowY: "auto"
          }}>
           {/* <StudyOrder setShowMakeOrder={setShowMakeOrder} encounter={encounter}></StudyOrder> */}
          </div>
        </div>

      </>

    )

  return (
    <div className='flex flex-col bg-white' style={{
      height: ` ${width >= WIDTH_XL
          ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)`
          : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
        }`,
      overflowY: "auto"
    }}>
      <Grid>
        <Grid className='w-full px-8'>
          <div className='flex flex-row justify-between md-max:flex-col'>
            <Grid>
              <Typography variant='h5' color='textPrimary'>
                Resultados de estudios
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                archivos subidos por el paciente, laboratorios o dispositivos médicos
              </Typography>
            </Grid>
            {appointment &&
              <div
                title={
                  disabledButton
                    ? appointment.status === 'locked'
                      ? 'No disponible en citas culminadas'
                      : 'La gestión de órdenes se habilitará ' + TIME_TO_OPEN_APPOINTMENT + ' minutos antes del inicio de la cita'
                    : 'Aquí puede gestionar las órdenes de estudio y emitirlas'
                }
              >
                <button className={`btn ${disabledButton ? 'bg-gray-200 cursor-not-allowed' : 'bg-primary-600'} text-white border-transparent focus:outline-none flex flex-row justify-end items-center px-2 py-0 h-10 rounded-l-3xl rounded-r-3xl text-clip md-max:mt-2`}
                  onClick={() => setShowMakeOrder(true)}
                  disabled={disabledButton}
                >
                  <div>Emitir orden de estudio</div>
                  <OrderAdd className="mx-0.5 p-0 "></OrderAdd>
                </button>
              </div>
            }
          </div>
          <div className="flex flex-row flex-no-wrap w-full justify-end">
            <div className="flex w-96">
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
          </div>
          {toggleStudies && loading === false && studiesData === undefined && <Grid className="grid mt-20 place-items-center"  >
            <NoResults />
          </Grid>
          }
          <Grid className="mt-5">

            {loading && <div className='flex items-center justify-center w-full h-full py-64'>
              <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
                <SpinnerLoading />
              </div>
            </div>
            }

            {
              toggleStudies && loading === false && studiesData && studiesTable()
            }
            {
              !toggleStudies && loadingIssued === false && issuedStudiesTable()
            }
            {!toggleStudies && loadingIssued && <div className='flex items-center justify-center w-full h-full py-64'>
              <div className='flex items-center justify-center w-12 h-12 mx-auto bg-gray-100 rounded-full'>
                <SpinnerLoading />
              </div>
            </div>
            }
          </Grid>
        </Grid>
      </Grid>

    </div>
  )

  function studiesTable() {
    return (
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: 'No hay datos por mostrar',
          },
          pagination: {
            firstAriaLabel: 'Primera página',
            firstTooltip: 'Primera página',
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsPerPage: 'Filas por página:',
            labelRowsSelect: 'filas',
            lastAriaLabel: 'Ultima página',
            lastTooltip: 'Ultima página',
            nextAriaLabel: 'Pagina siguiente',
            nextTooltip: 'Pagina siguiente',
            previousAriaLabel: 'Pagina anterior',
            previousTooltip: 'Pagina anterior',
          },
        }}
        icons={tableIcons}
        columns={[
          {
            title: <SelectCategory categorySelect={categorySelect} setCategory={setCategory}></SelectCategory>,
            field: 'category',
            sorting: false,
            render: rowData => {
              // console.log(rowData.diagnosis)
              //@ts-ignore
              return (
                rowData.category !== null ?
                  <Grid container>
                    {rowData.category === "LABORATORY" ? <LabIcon />
                      : rowData.category === "IMAGE" ? <ImgIcon />
                        : <OtherIcon />
                    }
                    <p style={{ marginLeft: '10px' }}> </p>  {rowData.category === "LABORATORY" ? "Laboratorio"
                      : rowData.category === "IMAGE" ? "Imágenes"
                        : "Otros"


                    }
                  </Grid> : <>vacio</>
              )

            },
          },
          {
            title: "Fecha",
            field: "effectiveDate",
            width: "10%",
            render: rowData => (moment(rowData.effectiveDate).format('DD/MM/YYYY'))
          },
          {
            title: 'Descripción',
            field: 'description',
            sorting: false,
            render: rowData => {
              // console.log(rowData.diagnosis)
              //@ts-ignore
              return (
                <Grid container>
                  <p style={{ marginTop: '3px' }}></p> {rowData.description !== null && rowData.description}
                </Grid>
              )
            },
          },
          {
            title: "Fuente",
            field: "source",
            sorting: false,
            render: rowData => toUpperLowerCase(rowData.source) 
          },
        ]}
        // eslint-disable-next-line eqeqeq
        data={studiesData.filter((data) => (data.category == categorySelect || categorySelect == ""))}
        onRowClick={(evt, selectedRow) =>
          //@ts-ignore
          setSelectedRow(selectedRow)
        }
        options={{
          search: false,
          toolbar: false,
          paging: studiesData.length > 10,
          draggable: false,
          pageSize: 10,
          rowStyle: (rowData) => ({
            borderTop: '10px solid white',
            borderRadius: '10px',
            backgroundColor: "#F7FAFC",
          }),
        }}
      />
    )
  }

  function issuedStudiesTable() {
    //parsing category
    const categoryIssuedOrders = {
      LABORATORY: 'Laboratory',
      IMAGE: 'Diagnostic Imaging',
      OTHER: 'Other'
    }

    return (
      <MaterialTable
        localization={{
          body: {
            emptyDataSourceMessage: 'No hay datos por mostrar',
          },
          pagination: {
            firstAriaLabel: 'Primera página',
            firstTooltip: 'Primera página',
            labelDisplayedRows: '{from}-{to} de {count}',
            labelRowsPerPage: 'Filas por página:',
            labelRowsSelect: 'filas',
            lastAriaLabel: 'Ultima página',
            lastTooltip: 'Ultima página',
            nextAriaLabel: 'Pagina siguiente',
            nextTooltip: 'Pagina siguiente',
            previousAriaLabel: 'Pagina anterior',
            previousTooltip: 'Pagina anterior',
          },
        }}
        icons={tableIcons}
        columns={[
          {
            title: <SelectCategory categorySelect={categorySelect} setCategory={setCategory}></SelectCategory>,
            field: 'category',
            sorting: false,
            render: rowData => {
              //@ts-ignore
              return (
                rowData.category !== null ?
                  <Grid container>
                    {rowData.category === "Laboratory" ? <LabIcon />
                      : rowData.category === "Diagnostic Imaging" ? <ImgIcon />
                        : <OtherIcon />
                    }
                    <p style={{ marginLeft: '10px' }}> </p>  {rowData.category === "Laboratory" ? "Laboratorio"
                      : rowData.category === "Diagnostic Imaging" ? "Imágenes"
                        : "Otros"
                    }
                  </Grid> : <>vacio</>
              )

            },
          },
          {
            title: "Fecha",
            field: "authoredDate",
            width: "10%",
            render: rowData => moment(rowData.authoredDate).format('DD/MM/YYYY')
          },
          {
            title: 'Estudios a realizar',
            field: 'studiesCodes',
            sorting: false,
            width:"80%",
            render: rowData => {
              // console.log(rowData.diagnosis)
              //@ts-ignore
              return (
                <p className="truncate sm:w-32 md:w-52 lg:56 xl:w-72">
                  {rowData.studiesCodes.map(i => { return i.display }).join(', ')}
                </p>
              )
            },
          }
        ]}
        // eslint-disable-next-line eqeqeq
        data={issuedStudiesData.filter((i) => i.category === categoryIssuedOrders[categorySelect] || categorySelect === "")}
        onRowClick={(evt, selectedRowIssued) => {
          //@ts-ignore
          setSelectedRowIssued(selectedRowIssued)
        }
        }
        options={{
          search: false,
          toolbar: false,
          paging: issuedStudiesData.length > 10,
          draggable: false,
          pageSize: 10,
          rowStyle: (rowData) => ({
            borderTop: '10px solid white',
            borderRadius: '10px',
            backgroundColor: "#F7FAFC",
          }),
        }}
      />
    )
  }

  function laboratoryDetail() {

    if (studyDetail === undefined)
      return (
        <div className='flex flex-row items-center justify-center w-full h-full'>
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

    return <div className="flex flex-col flex-no-wrap" style={{
      height: ` ${width >= WIDTH_XL
        ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)`
        : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
      }`,
    overflowY: "auto"
    }}>
      <Grid className='w-full px-8'>
        <Grid container>
          <button
            style={{ backgroundColor: '#27BEC2', height: '48px', width: '48px' }}
            className='flex items-center justify-center mt-3 rounded-full focus:outline-none focus:bg-gray-600'
            onClick={() => {
              setSelectedRow(undefined);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7.0007H3.82998L8.70998 2.1207C9.09998 1.7307 9.09998 1.0907 8.70998 0.700703C8.31998 0.310703 7.68998 0.310703 7.29998 0.700703L0.70998 7.2907C0.31998 7.6807 0.31998 8.3107 0.70998 8.7007L7.29998 15.2907C7.68998 15.6807 8.31998 15.6807 8.70998 15.2907C9.09998 14.9007 9.09998 14.2707 8.70998 13.8807L3.82998 9.0007H15C15.55 9.0007 16 8.5507 16 8.0007C16 7.4507 15.55 7.0007 15 7.0007Z" fill="white" />
            </svg>

          </button>
          <Typography style={{ padding: '20px' }} variant='h5' color='textPrimary'>

            { //@ts-ignore
              studyDetail.description}
          </Typography>
        </Grid>
        <Grid container justifyContent="space-between" className="mt-10">

          <Card
            style={{
              backgroundColor: '#F7FAFC',
              borderRadius: '16px',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',
            }}
          >
            <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280', marginBottom: '0.5rem' }}>
              Origen
            </Typography>
            {//@ts-ignore
              getSourceSVG(studyDetail.source)}

          </Card>

          <Card
            style={{
              backgroundColor: '#F7FAFC',
              borderRadius: '16px',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',

            }}
          >
            <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
              Resultados con fecha
            </Typography>
            <Card
              className="mt-3"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: 'none',
                marginBottom: '15px',
                padding: '5px',
                width: '200px'
              }}
            >
              <Grid container>
                <Calendar />
                <Grid>
                  <Typography variant='body2' color='textSecondary'>
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

          </Card>

          <Card
            style={{
              backgroundColor: '#F7FAFC',
              borderRadius: '16px',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',
            }}
          >
            <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
              Orden
            </Typography>
            <Card
              className="mt-3"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: 'none',
                marginBottom: '15px',
                padding: '5px',
                width: '200px',
                minWidth: '50px'
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                Sin orden
              </Typography>
            </Card>
          </Card>
        </Grid>
        { studyDetail?.conclusion &&
          <Card
            className="mt-3"
            style={{
              backgroundColor: '#F7FAFC',
              borderRadius: '16px',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',
              minHeight: '300px'
            }}
          >
            <Typography variant='h6' noWrap style={{ padding: '20px', textAlign: 'left', color: '#6B7280' }}>
              Conclusión
            </Typography>
            <Typography variant='body1' noWrap style={{ padding: '20px', textAlign: 'left', color: '#6B7280' }}>
              {studyDetail.conclusion}
            </Typography>
          </Card>
        }
        <Grid
          className="mt-15"
        >
          <Divider
            style={{
              height: '1px',
              // width: '100%',
              background: '#EDF2F7',
            }}
          />

          <Grid className="mt-3" container>
            <svg className="mt-2" width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.172 4.99968L5.58602 11.5857C5.395 11.7702 5.24264 11.9909 5.13782 12.2349C5.033 12.4789 4.97783 12.7413 4.97552 13.0069C4.97321 13.2724 5.02381 13.5358 5.12438 13.7816C5.22494 14.0274 5.37344 14.2507 5.56123 14.4385C5.74902 14.6263 5.97232 14.7748 6.21811 14.8753C6.4639 14.9759 6.72726 15.0265 6.99282 15.0242C7.25838 15.0219 7.52082 14.9667 7.76483 14.8619C8.00884 14.7571 8.22953 14.6047 8.41402 14.4137L14.828 7.82768C15.5567 7.07327 15.9598 6.06286 15.9507 5.01407C15.9416 3.96528 15.5209 2.96203 14.7793 2.2204C14.0377 1.47877 13.0344 1.05809 11.9856 1.04898C10.9368 1.03987 9.92643 1.44304 9.17202 2.17168L2.75702 8.75668C1.63171 9.88199 0.999512 11.4082 0.999512 12.9997C0.999512 14.5911 1.63171 16.1174 2.75702 17.2427C3.88233 18.368 5.40859 19.0002 7.00002 19.0002C8.59145 19.0002 10.1177 18.368 11.243 17.2427L17.5 10.9997" stroke="#364152" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <Typography variant='h6' noWrap style={{ paddingLeft: '10px', textAlign: 'left', color: '#6B7280' }}>
              Adjuntos
            </Typography>
          </Grid>
          <div className="p-3 flex overflow-x-auto space-x-8 w-100">
            {
              //@ts-ignore
              studyDetail.attachmentUrls.map((book, idx) => {
                const { contentType, url, title } = book;
                return (
                  <section style={{ backgroundColor: '#F7FAFC' }} className="flex-shrink-0 rounded-full">
                    <Grid className="p-2" container>
                      {
                        contentType.includes("pdf") ? <svg className="mt-2" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 0H6C4.9 0 4 0.9 4 2V14C4 15.1 4.9 16 6 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM9.5 7.5C9.5 8.33 8.83 9 8 9H7V10.25C7 10.66 6.66 11 6.25 11C5.84 11 5.5 10.66 5.5 10.25V6C5.5 5.45 5.95 5 6.5 5H8C8.83 5 9.5 5.67 9.5 6.5V7.5ZM14.5 9.5C14.5 10.33 13.83 11 13 11H11C10.72 11 10.5 10.78 10.5 10.5V5.5C10.5 5.22 10.72 5 11 5H13C13.83 5 14.5 5.67 14.5 6.5V9.5ZM18.5 5.75C18.5 6.16 18.16 6.5 17.75 6.5H17V7.5H17.75C18.16 7.5 18.5 7.84 18.5 8.25C18.5 8.66 18.16 9 17.75 9H17V10.25C17 10.66 16.66 11 16.25 11C15.84 11 15.5 10.66 15.5 10.25V6C15.5 5.45 15.95 5 16.5 5H17.75C18.16 5 18.5 5.34 18.5 5.75ZM7 7.5H8V6.5H7V7.5ZM1 4C0.45 4 0 4.45 0 5V18C0 19.1 0.9 20 2 20H15C15.55 20 16 19.55 16 19C16 18.45 15.55 18 15 18H3C2.45 18 2 17.55 2 17V5C2 4.45 1.55 4 1 4ZM12 9.5H13V6.5H12V9.5Z" fill="#E53E3E" />
                        </svg> : <svg className="mt-2" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 9.25C10.24 9.25 11.25 8.24 11.25 7C11.25 5.76 10.24 4.75 9 4.75C7.76 4.75 6.75 5.76 6.75 7C6.75 8.24 7.76 9.25 9 9.25ZM13.5 13.25C13.5 11.75 10.5 11 9 11C7.5 11 4.5 11.75 4.5 13.25V14H13.5V13.25ZM16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM15 16H3C2.45 16 2 15.55 2 15V3C2 2.45 2.45 2 3 2H15C15.55 2 16 2.45 16 3V15C16 15.55 15.55 16 15 16Z" fill="#3182CE" />
                        </svg>}

                      <Typography className='w-40 hover:w-auto' variant='subtitle1' noWrap title={book.title} style={{ paddingTop: '2px', paddingLeft: '10px', textAlign: 'left', color: '#6B7280' }}>
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
      <Modal show={showEditModal} setShow={setShowEditModal} size='xl3'  >
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
            <div style={{ width: '300px', margin: 'auto' }} className='flex items-center justify-center w-full h-full py-64'>
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

  function issuedDetail(order) {
    return <div className="flex flex-col flex-no-wrap" style={{
      height: ` ${width >= WIDTH_XL
          ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR}px)`
          : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + ORGANIZATION_BAR + HEIGHT_NAVBAR}px)`
        }`,
      overflowY: "auto"
    }}>
      <Grid className='w-full px-8'>
        <Grid container>
          <button
            style={{ backgroundColor: '#27BEC2', height: '48px', width: '48px' }}
            className='flex items-center justify-center mt-3 rounded-full focus:outline-none focus:bg-gray-600'
            onClick={() => {
              setSelectedRowIssued(undefined);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7.0007H3.82998L8.70998 2.1207C9.09998 1.7307 9.09998 1.0907 8.70998 0.700703C8.31998 0.310703 7.68998 0.310703 7.29998 0.700703L0.70998 7.2907C0.31998 7.6807 0.31998 8.3107 0.70998 8.7007L7.29998 15.2907C7.68998 15.6807 8.31998 15.6807 8.70998 15.2907C9.09998 14.9007 9.09998 14.2707 8.70998 13.8807L3.82998 9.0007H15C15.55 9.0007 16 8.5507 16 8.0007C16 7.4507 15.55 7.0007 15 7.0007Z" fill="white" />
            </svg>

          </button>
          <Typography style={{ padding: '20px' }} variant='h5' color='textPrimary'>
            Estudios a realizar
          </Typography>
        </Grid>
        <Grid container justifyContent="flex-start" className="mt-10">
          <Card
            style={{
              backgroundColor: '#F7FAFC',
              borderRadius: '16px',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',
              marginRight: '3rem'
            }}
          >
            <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
              Solicitado en fecha
            </Typography>
            <Card
              className="mt-3"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: 'none',
                marginBottom: '15px',
                padding: '5px',
                width: '200px'
              }}
            >
              <Grid container>
                <Calendar />
                <Grid>
                  <Typography variant='body2' color='textSecondary'>
                    {
                      order.authoredDate ? moment(order.authoredDate).format('DD/MM/YYYY') : 'Fecha Desconocida'
                    }
                  </Typography>
                  <Typography style={{ marginTop: '-5px' }} variant='body1' color='textPrimary'>
                    {
                      order.authoredDate ? countDays(order.authoredDate) : ''
                    }
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Card>

          <Card
            style={{
              backgroundColor: '#F7FAFC',
              borderRadius: '16px',
              boxShadow: 'none',
              marginBottom: '15px',
              padding: '15px',
            }}
          >
            <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280' }}>
              Impresión diagnóstica
            </Typography>

            <Card
              className="mt-3"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                boxShadow: 'none',
                marginBottom: '15px',
                padding: '5px',
                width: '200px',
                minWidth: '50px'
              }}
            >
              <Typography variant='body2' color='textSecondary'>
                {order.diagnosis}
              </Typography>
            </Card>
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
            minHeight: '300px'
          }}
        >
          <Typography variant='h6' noWrap style={{ padding: '20px', textAlign: 'left', color: '#6B7280' }}>
            <div style={{ display: 'flex' }}>
              {order.category === "Laboratory" ?
                <LabIcon width={22} height={22} preserveAspectRatio="none" />
                : order.category === "Diagnostic Imaging" ?
                  <ImgIcon width={22} height={22} preserveAspectRatio="none" /> :
                  <OtherIcon width={22} height={22} preserveAspectRatio="none" />
              }
              <Typography variant='body2' color='textSecondary' style={{ marginLeft: '10px', }}>
                {order.category === "Laboratory" ? "Laboratorio"
                  : order.category === "Diagnostic Imaging" ? "Imágenes"
                    : "Otros"
                }
              </Typography>
            </div>
            <Typography style={{ marginLeft: '1rem', marginTop: '1rem' }}>
              {order.studiesCodes.map((i) => (<li>{i.display}</li>))}
            </Typography>
            <Typography variant='subtitle1' noWrap style={{ textAlign: 'left', color: '#6B7280', marginTop: '1rem' }}>
              Observaciones
            </Typography>
            {order.notes ?? 'Sin observaciones.'}
          </Typography>
        </Card>
      </Grid>
    </div>
  }
}

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
        marginRight: "0.313rem",
        cursor: "default"
      },
      '& .MuiListItem-root.Mui-selected': {
        backgroundColor: "#EDFAFA"
      },
      '& .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
        backgroundColor: "#EDFAFA"
      },
      '& .MuiSelect-select.MuiSelect-select': {
        paddingRight: "0.313rem"
      }
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
        IconComponent={() => <FilterListIcon></FilterListIcon>}
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