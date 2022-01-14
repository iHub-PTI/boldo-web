import React from "react";
import { Grid, withStyles } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';



const ToolTipSoepHelper = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#FFFF',
    color: 'black',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    borderWidth: '2px', borderColor: '#d0ebee',
    borderStyle: 'solid', borderRadius: '10px'
  },
}))(Tooltip);

const ShowSoepHelper = ({ title, isBlackColor }: { title: String, isBlackColor: boolean }) => {

  var description = "";
  switch (title) {
    case 'Subjetivo':
      description = "Aquí se consignan los datos recogidos en el interrogatorio, conjuntamente con las impresiones subjetivas del médico y las expresadas por el paciente."
      break;
    case 'Objetivo':
      description = "En este apartado se anotan los datos del examen físico y / o exámenes complementarios."
      break;
    case 'Evaluacion':
      description = "En esta sección se registra la interpretación del problema identificado y su reevaluación"
      break;
    case 'Plan':
      description = "Aquí se registra la planificación de las conductas que se tomarán. Existen cuatro tipos de planes: · Plan diagnóstico · Plan terapéutico · Plan de seguimiento · Plan de educación."
      break;

    default:
      break;
  }

  return <ToolTipSoepHelper

    title={description}
  >
    <Grid style={{ paddingLeft: '10px' }}  >
      {

        isBlackColor ? <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM10 7C9.8243 6.99983 9.65165 7.04595 9.49945 7.13373C9.34724 7.22151 9.22085 7.34784 9.133 7.5C9.06957 7.61788 8.98311 7.72182 8.87876 7.80566C8.77441 7.8895 8.65429 7.95154 8.52552 7.9881C8.39675 8.02466 8.26194 8.03499 8.12911 8.01849C7.99627 8.00198 7.86809 7.95897 7.75218 7.89201C7.63628 7.82505 7.53499 7.7355 7.45433 7.62867C7.37367 7.52184 7.31529 7.3999 7.28263 7.27008C7.24997 7.14027 7.24371 7.00522 7.26421 6.87294C7.28472 6.74065 7.33157 6.61384 7.402 6.5C7.73222 5.92811 8.24191 5.48116 8.85203 5.22846C9.46214 4.97576 10.1386 4.93144 10.7765 5.10236C11.4143 5.27328 11.978 5.64989 12.38 6.1738C12.782 6.6977 13 7.33962 13 8C13.0002 8.62062 12.8079 9.22603 12.4498 9.73285C12.0916 10.2397 11.5851 10.623 11 10.83V11C11 11.2652 10.8946 11.5196 10.7071 11.7071C10.5196 11.8946 10.2652 12 10 12C9.73478 12 9.48043 11.8946 9.29289 11.7071C9.10536 11.5196 9 11.2652 9 11V10C9 9.73478 9.10536 9.48043 9.29289 9.29289C9.48043 9.10536 9.73478 9 10 9C10.2652 9 10.5196 8.89464 10.7071 8.70711C10.8946 8.51957 11 8.26522 11 8C11 7.73478 10.8946 7.48043 10.7071 7.29289C10.5196 7.10536 10.2652 7 10 7ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" fill="#364152" />
        </svg> :
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 12.1217 17.1571 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18C7.87827 18 5.84344 17.1571 4.34315 15.6569C2.84285 14.1566 2 12.1217 2 10C2 7.87827 2.84285 5.84344 4.34315 4.34315C5.84344 2.84285 7.87827 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10ZM10 7C9.8243 6.99983 9.65165 7.04595 9.49945 7.13373C9.34724 7.22151 9.22085 7.34784 9.133 7.5C9.06957 7.61788 8.98311 7.72182 8.87876 7.80566C8.77441 7.8895 8.65429 7.95154 8.52552 7.9881C8.39675 8.02466 8.26194 8.03499 8.12911 8.01849C7.99627 8.00198 7.86809 7.95897 7.75218 7.89201C7.63628 7.82505 7.53499 7.7355 7.45433 7.62867C7.37367 7.52184 7.31529 7.3999 7.28263 7.27008C7.24997 7.14027 7.24371 7.00522 7.26421 6.87294C7.28472 6.74065 7.33157 6.61384 7.402 6.5C7.73222 5.92811 8.24191 5.48116 8.85203 5.22846C9.46214 4.97576 10.1386 4.93144 10.7765 5.10236C11.4143 5.27328 11.978 5.64989 12.38 6.1738C12.782 6.6977 13 7.33962 13 8C13.0002 8.62062 12.8079 9.22603 12.4498 9.73285C12.0916 10.2397 11.5851 10.623 11 10.83V11C11 11.2652 10.8946 11.5196 10.7071 11.7071C10.5196 11.8946 10.2652 12 10 12C9.73478 12 9.48043 11.8946 9.29289 11.7071C9.10536 11.5196 9 11.2652 9 11V10C9 9.73478 9.10536 9.48043 9.29289 9.29289C9.48043 9.10536 9.73478 9 10 9C10.2652 9 10.5196 8.89464 10.7071 8.70711C10.8946 8.51957 11 8.26522 11 8C11 7.73478 10.8946 7.48043 10.7071 7.29289C10.5196 7.10536 10.2652 7 10 7ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" fill="white" />
          </svg>
      }
    </Grid>


  </ToolTipSoepHelper>
}

export default ShowSoepHelper;