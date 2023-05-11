import MaterialTable, { Icons } from 'material-table';
import moment from 'moment';
import React, { forwardRef } from 'react';
import axios from 'axios'
import handleSendSentry from '../../util/Sentry/sentryHelper';
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders';
import NextPage from '../icons/upload-icons/NextPage';
import PreviousPage from '../icons/upload-icons/PreviousPage';


type Props = {
  patientId: string
}

const tableIcons: Icons = {
  NextPage: forwardRef(() => <NextPage />),
  PreviousPage: forwardRef(() => <PreviousPage />)

}


const TableOfStudies = (props: Props) => {
  const {patientId} = props

  return (
    <MaterialTable
      icons={tableIcons}
      columns={[
        {
          title: "Categoria",
          field: "category",
          sorting: false
        },
        {
          title: "Fecha",
          field: "effectiveDate",
          width: "10%",
          render: rowData => (moment(rowData.effectiveDate).format('DD/MM/YYYY'))
        },
        {
          title: "Nro Orden",
          field: "orderNumber",
          sorting: false
        }
      ]}
      data={query =>
        new Promise(async (resolve, reject) => {
          let url = '/profile/doctor/serviceRequests'
          await axios
            .get(url, {
              params: {
                patient_id: patientId,
                page: (query.page + 1),
                count: query.pageSize
              }
            })
            .then((res) => {
              resolve({
                data: res.data.items,
                page: (query.page - 1),
                totalCount: res.data.total,
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
      options={{
        search: false,
        toolbar: false,
        draggable: false,
        paging: true,
        pageSize: 5,
      }}
    />
  );
}


export default TableOfStudies;