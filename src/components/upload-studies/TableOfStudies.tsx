import React, { forwardRef, useContext, useState } from 'react';
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
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import FilterIcon from '../icons/upload-icons/FilterIcon';
import NoProfilePicture from '../icons/NoProfilePicture';
import UnderlinedIcon from '../icons/upload-icons/UnderlinedIcon';
import KeyboardArrowUpIcon from '../icons/upload-icons/KeyboardArrowUpIcon';
import ImportIcon from '../icons/upload-icons/ImportIcon';
import { ReactComponent as SpinnerLoading } from "../../assets/spinner-loading.svg";


type Props = {
  patientId: string;
  handleShowOrderImported: () => void;

}
// types of order study
export type Categories = "" | "Laboratory" | "Diagnostic" | "Other";

// map the code of the category
const CategoryCode = {
  "Laboratory": "LAB",
  "Diagnostic": "IMG",
  "Other": "OTH",
  "": "",
}


const tableIcons: Icons = {
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Filter: forwardRef(() => <FilterIcon />),
  NextPage: forwardRef(() => <NextPage />),
  PreviousPage: forwardRef(() => <PreviousPage />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward style={{ color: "#13A5A9" }} {...props} ref={ref} />),
}

const CONFIG_LOCALIZATION = {
  body: {
    emptyDataSourceMessage: 'No se encontró ninguna orden de estudios.',
  },
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

const TableOfStudies = (props: Props) => {
  const { patientId, handleShowOrderImported } = props
  const [categorySelected, setCategorySelected] = useState<Categories>('')
  const [loadingOrderImported, setLoadingOrderImported] = useState<boolean>(false)
  const { setOrderImported } = useContext(OrderStudyImportedContext)

  const getOrderStudyImported = (rowData) => {
    setLoadingOrderImported(true)
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
        setLoadingOrderImported(false)
        handleShowOrderImported()
      })
  }

  return (
    <MaterialTable
      actions={[
        {
          icon: () => loadingOrderImported ? <SpinnerLoading /> : <ImportIcon />,
          onClick: async (event, rowData) => {
            getOrderStudyImported(rowData)
          },
          tooltip: 'Importar orden de estudios',
        }
      ]}
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
          render: rowData => <p className='not-italic font-normal text-sm leading-5 text-gray-900'>{rowData.orderNumber}</p>,
          width: "5%"
        }
      ]}
      data={query =>
        new Promise(async (resolve, reject) => {
          let url = '/profile/doctor/serviceRequests'
          await axios
            .get(url, {
              params: {
                patient_id: patientId ?? '',
                page: (query.page + 1),
                count: query.pageSize,
                category: CategoryCode[categorySelected] ?? ''
              }
            })
            .then((res) => {
              resolve({
                data: res.data.items,
                page: (query.page),
                totalCount: res.data.total
              })
            })
            .catch((err) => {
              const tags = {
                "endpoint": url,
                "method": "GET",
                "patient_id": patientId
              }
              handleSendSentry(err, ERROR_HEADERS.SERVICE_REQUEST.FAILURE_GET, tags)
              reject(err)
            })
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
      localization={CONFIG_LOCALIZATION}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      options={{
        detailPanelColumnAlignment: "right",
        draggable: false,
        hideFilterIcons: false,
        loadingType: "overlay",
        maxBodyHeight: "340px",
        overflowY: "auto",
        padding: "dense",
        pageSize: 5,
        pageSizeOptions: [3, 5, 8, 10],
        toolbar: false,
        search: false,
        showFirstLastPageButtons: false,
      }}
    />
  );
}


export default TableOfStudies;