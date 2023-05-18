import React, { forwardRef, useState } from 'react';
import MaterialTable, { Icons } from 'material-table';
import axios from 'axios'
import moment from 'moment';
import DetailPanel from './DetailPanel';
import Category from './Category';
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import NextPage from '../icons/upload-icons/NextPage';
import PreviousPage from '../icons/upload-icons/PreviousPage';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import FilterIcon from '../icons/upload-icons/FilterIcon';
import SelectCategory from './SelectCategory';
import NoProfilePicture from '../icons/NoProfilePicture';


type Props = {
  patientId: string
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


const TableOfStudies = (props: Props) => {
  const {patientId} = props
  const [categorySelected, setCategorySelected] = useState<Categories>('')

  return (
    <MaterialTable
      icons={tableIcons}
      columns={[
        {
          field: "id",
          hidden: true,
          title: "id",
        },
        {
          render: () => <NoProfilePicture className='bg-gray-200 rounded-full border-gray-200 border-1 w-9 h-9' />,
          title: "",
          sorting: false
        },
        {
          render: () => <p>Dr. Mario Cabañas</p>,
          title: "Nombre del médico",
          sorting: false,
          width: "30%",
        },
        {
          field: "category",
          render: rowData => <Category category={rowData.category} />,
          sorting: false,
          title: <SelectCategory categorySelected={categorySelected} setCategorySelected={setCategorySelected} />,
        },
        {
          field: "authoredDate",
          title: "Fecha",
          render: rowData => (moment(rowData.authoredDate).format('DD/MM/YYYY')),
        },
        {
          field: "orderNumber",
          sorting: false,
          title: "Nro Orden",
        }
      ]}
      localization={{
        body: {
          emptyDataSourceMessage: 'No se encontró ninguna orden de estudios.',
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
      }}
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
                page: (query.page - 1),
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
      detailPanel={rowData => {
        return (
          <DetailPanel orderId={`${rowData.id ?? ''}`}/>
        )
      }}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
      options={{
        detailPanelColumnAlignment: "right",
        draggable: false,
        hideFilterIcons: false,
        loadingType: "overlay",
        maxBodyHeight: "340px",
        overflowY: "auto",
        pageSize: 3,
        pageSizeOptions: [3,5,8,10],
        toolbar: false,
        search: false,
        showFirstLastPageButtons: false,
      }}
    />
  );
}


export default TableOfStudies;