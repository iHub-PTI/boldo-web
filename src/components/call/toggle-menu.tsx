import { makeStyles } from "@material-ui/core";
import Tooltip from '@material-ui/core/Tooltip';
import MdClose from '@material-ui/icons/Clear';
import MdAdd from '@material-ui/icons/MoreVert';
import React, { useEffect, useState } from "react";
import { ChildButton, Directions, FloatingMenu, MainButton } from 'react-floating-button-menu';
import { usePrescriptionContext } from "../../contexts/Prescriptions/PrescriptionContext";
import CircleCounter from "../CircleCounter";
import SelectPrintOptions from "../SelectPrintOptions";
import { ReactComponent as PillIcon } from '../../assets/pill.svg';
import { ReactComponent as RecordIcon } from '../../assets/record-table.svg';


//TODO: Colocar sus tipos de datos según correspondan | actualizar.
// Mientras se implementa de esta forma para arreglar el refetch.
export const ToggleMenu = ({
    id,
    orders,
    appointment,
    selectedButton,
    setSideBarAction,
    setSelectedButton
}) => {
    const [isOpen, setIsOpen] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { prescriptions, updatePrescriptions } = usePrescriptionContext();

    const useTooltipStyles = makeStyles(() => ({
        tooltip: {
          margin: 20,
    
        },
      }));

    useEffect(() => {
      updatePrescriptions(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div>
        <FloatingMenu slideSpeed={500} isOpen={isOpen} spacing={8} direction={Directions.Up}>
          <MainButton
            isOpen={isOpen}
            iconResting={
              <Tooltip title={<h1 style={{ fontSize: 14 }}>Ver opciones</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
                <MdAdd style={{ fontSize: 20, color: 'white' }} />
              </Tooltip>
            }
            iconActive={
              <Tooltip title={<h1 style={{ fontSize: 14 }}>Cerrar</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
                <MdClose style={{ fontSize: 20, color: 'white' }} />
              </Tooltip>
            }
            background='#323030'
            onClick={() => {
              setIsOpen(prev => !prev)
            }}
            size={50}
          />
          {/* <ChildButton
            icon={
              <Print
                className={`focus:outline-none ${loading ? 'cursor-not-allowed' : ''}`}
                bgColor='transparent'
                iconColor='white'
                fromVirtual={true}
              />
            }
            background={prescriptions.length > 0 ? '#27BEC2' : '#323030'}
            size={50}
            onClick={() => {
              if (prescriptions?.length > 0) {
                if (!loading && appointment !== undefined) {
                  addToast({ type: 'success', text: 'Descargando receta...' });
                  getReports(appointment, setLoading);
                }
              } else {
                console.log("there is not prescriptions");
                if (appointment?.status === 'open' || appointment?.status === 'closed') {
                  addToast({ type: 'info', title: 'Atención!', text: 'Debe agregar alguna receta para imprimirla.' });
                } else if (appointment?.status === 'locked') {
                  addToast({ type:'info', title: 'Atención!', text: 'No posee recetas para imprimir.' })
                } else if (appointment?.status === 'upcoming') {
                  addToast({ type: 'info', title: 'Atención!', text: 'Esta funcionalidad estará disponible durante la cita.' })
                }
              }
            }}
          /> */}
          <ChildButton
            icon={<SelectPrintOptions virtual={true} {...appointment} />}
            size={50}
          />
          <ChildButton
            icon={
              <Tooltip title={<h1 style={{ fontSize: 14 }}>Estudios</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
                <div className='flex'>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 2V4H8V18C8 19.0609 8.42143 20.0783 9.17157 20.8284C9.92172 21.5786 10.9391 22 12 22C13.0609 22 14.0783 21.5786 14.8284 20.8284C15.5786 20.0783 16 19.0609 16 18V4H17V2H7ZM11 16C10.4 16 10 15.6 10 15C10 14.4 10.4 14 11 14C11.6 14 12 14.4 12 15C12 15.6 11.6 16 11 16ZM13 12C12.4 12 12 11.6 12 11C12 10.4 12.4 10 13 10C13.6 10 14 10.4 14 11C14 11.6 13.6 12 13 12ZM14 7H10V4H14V7Z" fill="white" />
                  </svg>
                  { orders &&
                    orders.filter((order) => order.studies_codes.length > 0).length > 0
                    ? <CircleCounter items={orders.filter((order) => order.studies_codes.length > 0).length} fromVirtual={true} />
                    : <></>
                  }
                </div>
              </Tooltip>
            }
            background={selectedButton === 3 ? '#667EEA' : '#323030'}
            size={50}
            onClick={() => {
              setSideBarAction(3);
              setSelectedButton(3);
            }}
          />
          <ChildButton
            icon={
              <Tooltip title={<h1 style={{ fontSize: 14 }}>Recetas</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
                <div className='flex'>
                  <PillIcon style={{ fontSize: 20, color: 'white' }} />
                  {
                    prescriptions.length > 0
                      ? <CircleCounter items={prescriptions.length} fromVirtual={true} />
                      : <></>
                  }
                </div>
              </Tooltip>
            }
            background={selectedButton === 2 ? '#667EEA' : '#323030'}
            size={50}
            onClick={() => {
              setSideBarAction(2);
              setSelectedButton(2);
            }}
          />
          <ChildButton
            icon={
              <Tooltip title={<h1 style={{ fontSize: 14 }}>Notas médicas</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
                <RecordIcon />
              </Tooltip>
            }
            background={selectedButton === 1 ? '#667EEA' : '#323030'}
            size={50}
            onClick={() => {
              setSideBarAction(1);
              setSelectedButton(1);
            }}
          />
          {/* <ChildButton
            icon={
              <Tooltip title={<h1 style={{ fontSize: 14 }}>Perfil del paciente</h1>} placement="left" leaveDelay={100} classes={useTooltipStyles()}>
                <PersonIcon style={{ fontSize: 20, color: 'white' }} />
              </Tooltip>
            }
            background={selectedButton === 0 ? '#667EEA' : '#323030'}
            size={50}
            onClick={() => {
              setSideBarAction(0);
              setSelectedButton(0);
            }}
          /> */}
        </FloatingMenu>
      </div>
    )
  }