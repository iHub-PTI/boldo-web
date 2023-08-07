import React, { forwardRef, useContext, useEffect, useRef, useState } from 'react';
import MaterialTable, { Icons } from 'material-table';
import axios from 'axios'
import moment from 'moment';
import { OrderStudyImportedContext } from '../../contexts/OrderImportedContext';
import DetailPanel from './DetailPanel';
import Category from './Category';
import DoctorName from './DoctorName';
import SelectCategory from './SelectCategory';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import NextPage from '../icons/upload-icons/NextPage';
import PreviousPage from '../icons/upload-icons/PreviousPage';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import FilterIcon from '../icons/upload-icons/FilterIcon';
import NoProfilePicture from '../icons/NoProfilePicture';
import UnderlinedIcon from '../icons/upload-icons/UnderlinedIcon';
import KeyboardArrowUpIcon from '../icons/upload-icons/KeyboardArrowUpIcon';
import ImportIcon from '../icons/upload-icons/ImportIcon';
import { ReactComponent as SpinnerLoading } from "../../assets/spinner-loading.svg";
import RetryRowsData from './RetryRowsData';
import { Tooltip, makeStyles } from '@material-ui/core';


type Props = {
  patientId: string;
  searchByOrder: string;
  handleShowOrderImported: () => void;
}

// types of order study
export type Categories = "" | "Laboratory" | "Diagnostic" | "Other";

// map the code of the category
const CategoryCode = {
  "Laboratory": "LAB",
  "Diagnostic Imaging": "IMG",
  "Other": "OTH",
  "": "",
}

const tableIcons: Icons = {
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Filter: forwardRef(() => <FilterIcon />),
  NextPage: forwardRef(() => <NextPage />),
  PreviousPage: forwardRef(() => <PreviousPage />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward style={{ color: "#13A5A9" }} {...props} ref={ref} />),
}

const CONFIG_LOCALIZATION = {
  header: {
    actions: ''
  },
  pagination: {
    firstAriaLabel: 'Primera página',
    firstTooltip: 'Primera página',
    labelDisplayedRows: '{from}-{to} de {count}',
    labelRowsPerPage: 'Filas por página:',
    labelRowsSelect: 'filas',
    lastAriaLabel: 'Última página',
    lastTooltip: 'Última página',
    nextAriaLabel: 'Página siguiente',
    nextTooltip: 'Página siguiente',
    previousAriaLabel: 'Página anterior',
    previousTooltip: 'Página anterior',
  },
}

type loaderRowData = {
  id: string,
  loading: boolean
}

const TableOfStudies = (props: Props) => {
  const { patientId, handleShowOrderImported, searchByOrder } = props
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadError, setLoadError] = useState<boolean>(false)
  const [categorySelected, setCategorySelected] = useState<Categories>('')
  const [pageSize, setPageSize] = useState<number>(5)
  const [loadingOrderImported, setLoadingOrderImported] = useState<loaderRowData>({
    id: '',
    loading: false,
  })
  const { setOrderImported, setPatientId } = useContext(OrderStudyImportedContext)

  //table ref
  const tableRef = useRef(null)

  // space bewteen button and tooltip
  const useTooltipStyles = makeStyles(() => ({
    tooltip: {
      margin: 5,
    },
  }))

  const getOrderStudyImported = (rowData) => {

    setLoadingOrderImported({
      id: rowData?.id,
      loading: true
    })

    let url = `/profile/doctor/serviceRequest/${rowData?.id ?? ''}`

    axios
      .get(url)
      .then((res) => {
        // console.log("ORDER STUDY => ", res.data)
        setOrderImported(res.data as Boldo.OrderStudy)
      })
      .catch((err) => {
        const tags = {
          "endpoint": url,
          "method": "GET"
        }
        handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET_DESCRIPTION, tags)
        setOrderImported({} as Boldo.OrderStudy)
      })
      .finally(() => {
        setLoadingOrderImported({
          id: '',
          loading: false,
        })
        handleShowOrderImported()
      })
  }

  useEffect(() => {
    if (!tableRef) return
    tableRef?.current?.onQueryChange()
  }, [categorySelected, searchByOrder])
  
  useEffect(() => {
    setPatientId(patientId)
  }, [patientId, setPatientId])

  return (
    <MaterialTable
      tableRef={tableRef}
      actions={[
        {
          icon: '',
          onClick: async (event, rowData) => {
            getOrderStudyImported(rowData)
          },
        }
      ]}
      components={{
        Action: props => {
          // console.log(props)
          return (
            <Tooltip
              title={<h1 style={{ fontSize: 14 }}>Importar orden de estudios</h1>}
              placement="right" 
              leaveDelay={100}
              classes={useTooltipStyles()}
            >
              <button
                className='focus:outline-none'
                onClick={(event) => props.action.onClick(event, props.data)}
                // title='Importar orden de estudios'
              >
                {loadingOrderImported.loading && props.data.id === loadingOrderImported.id ? <SpinnerLoading /> : <ImportIcon />}
              </button>
            </Tooltip>
          )
        },
        OverlayError: () => loadError ? <RetryRowsData loadRef={tableRef} /> : <></>
      }}
      columns={[
        {
          field: "id",
          hidden: true,
          title: "id",
        },
        {
          field: "doctor.photoUrl",
          render: (rowData) => rowData?.doctor?.photoUrl !== undefined
            ? <img
              src={rowData.doctor.photoUrl}
              alt='Foto de Perfil'
              className='flex-none border-1 border-white w-11 h-11 rounded-full object-cover'
            />
            : <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-11 h-11' />,
          title: "",
          sorting: false,
          width: "5%"
        },
        {
          field: "doctor",
          render: rowData => <DoctorName doctor={rowData.doctor} className='not-italic font-normal text-sm leading-6 text-gray-700' />,
          title: "Nombre del médico",
          sorting: false,
          width: "15%",
        },
        {
          field: "category",
          render: rowData => <Category category={rowData.category} />,
          sorting: false,
          title: <SelectCategory categorySelected={categorySelected} setCategorySelected={setCategorySelected} />,
        },
        {
          field: "authoredDate",
          render: rowData => <p className='not-italic font-normal text-sm leading-5 text-gray-900'>{(moment(rowData.authoredDate).format('DD/MM/YYYY'))}</p>,
          title: "Fecha",
        },
        {
          field: "orderNumber",
          sorting: false,
          title: "Nro Orden",
          render: rowData => <p className='not-italic font-normal text-sm leading-5 text-gray-900'>{rowData.orderNumber === 'studyOrderMain' ? 'No definido' : rowData.orderNumber}</p>,
          width: "5%"
        }
      ]}
      data={query =>
        new Promise(async (resolve, reject) => {
          let url = '/profile/doctor/serviceRequests'
          // console.log(query.orderDirection)
          setIsLoading(true)
          setPageSize(query.pageSize)
          await axios
            .get(url, {
              params: {
                // '0' for default to get an empty array
                patient_id: patientId ?? '0',
                orderNumber: searchByOrder,
                page: (query.page + 1),
                count: query.pageSize,
                dateOrder: query.orderDirection,
                category: CategoryCode[categorySelected] ?? ''
              }
            })
            .then((res) => {
              if (res.status === 204) {
                resolve({
                  data: [],
                  page: (query.page),
                  totalCount: 0
                })
              }
              resolve({
                data: res.data.items,
                page: (query.page),
                totalCount: res.data.total
              })
            })
            .catch((err) => {
              setLoadError(true)
              const tags = {
                "endpoint": url,
                "method": "GET",
                "patient_id": patientId
              }
              handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET, tags)
              reject(err)
            })
            .finally(() => setIsLoading(false))
        })
      }
      detailPanel={[{
        render: rowData => {
          return (
            <DetailPanel orderId={`${rowData.id ?? ''}`} />
          )
        },
        icon: () => <UnderlinedIcon text='ver más' />,
        openIcon: () => <KeyboardArrowUpIcon />,
        disabled: true // this disables all the dumb styles that are added to the icon
      }]}
      icons={tableIcons}
      localization={
        {
          ...CONFIG_LOCALIZATION, 
          body: {
            emptyDataSourceMessage: isLoading ? null : loadError ? '' : 'No se encontró ninguna orden de estudios.',
          }
        }
      }
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      options={{
        detailPanelColumnAlignment: "right",
        draggable: false,
        hideFilterIcons: false,
        loadingType: "overlay",
        maxBodyHeight: "340px",
        overflowY: "auto",
        padding: "dense",
        pageSize: pageSize,
        pageSizeOptions: [3, 5, 8, 10],
        toolbar: false,
        search: false,
        showFirstLastPageButtons: false,
      }}
    />
  );
}


export default TableOfStudies;