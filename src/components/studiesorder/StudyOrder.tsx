import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@material-ui/core'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { ReactComponent as IconAdd } from '../../assets/add-cross.svg'
import { ReactComponent as SpinnerL } from '../../assets/spinner-loading.svg'
import { ReactComponent as Spinner } from '../../assets/spinner.svg'
import { ReactComponent as TrashIcon } from '../../assets/trash.svg'
import { OrganizationContext } from '../../contexts/Organizations/organizationSelectedContext'
import { getStudyOrdersByEncounter } from '../../services/services'
import { ERROR_HEADERS } from '../../util/Sentry/errorHeaders'
import handleSendSentry from '../../util/Sentry/sentryHelper'
import { AppointmentWithPatient } from '../MenuStudyOrder'
import { useToasts } from '../Toast'
import HoverInfo from '../hovers/TooltipInfo'
import InfoIcon from '../icons/info-icons/InfoIcon'
import BoxSelect from './BoxSelect'
import CheckOrder from './CheckOrder'
import DisoclureOrder from './DisoclureOrder'
import InputText from './InputText'
import { StudiesTemplate } from './ModalTemplate/StudiesTemplate'
import { StudiesWithIndication } from './ModalTemplate/types'
import { CategoriesContext, Orders } from './Provider'
import SelectCategory from './SelectCategory'

//HoverSelect theme and Study Order styles
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuItem: {
      '&:active': {
        backgroundColor: '#EDFAFA',
      },
      '&:focus': {
        backgroundColor: '#EDFAFA',
      },
      '&:hover': {
        backgroundColor: '#EDFAFA',
      },
      '&:selected': {
        backgroundColor: 'black',
      },
    },
    select: {
      paddingTop: '0.2rem',
      paddingLeft: '0.3rem',
      borderRadius: '0.5rem',
      '&&&:before': {
        borderBottom: 'none',
      },
      '&&:after': {
        borderBottom: 'none',
      },
      '& .MuiSelect-select:focus': {
        backgroundColor: 'transparent',
      },
      '& .MuiSvgIcon-root': {
        color: '#13A5A9',
        //marginRight: "0.313rem",
        cursor: 'default',
      },
      '& .MuiListItem-root.Mui-selected': {
        backgroundColor: '#EDFAFA',
      },
      '& .MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected:hover': {
        backgroundColor: '#EDFAFA',
      },
    },
    form: {
      width: '100%',
      minWidth: '300px',
    },
    textfield: {
      backgroundColor: '#FFFFFF',
      width: '100%',
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#EDF2F7',
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: '#EDF2F7',
      },
      '& .Mui-disabled': {
        backgroundColor: '#f4f5f7',
      },
      border: '1px #EDF2F7',
    },
    textFieldDiag: {
      backgroundColor: '#FFFFFF',
      width: '100%',
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#EDF2F7',
      },
      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
        borderColor: '#EDF2F7',
      },
      '& .MuiOutlinedInput-input': {
        padding: '12px 14px 12px 14px',
      },
      '& .Mui-disabled': {
        backgroundColor: '#f4f5f7',
      },
      border: '1px #EDF2F7',
    },
    textfieldError: {
      backgroundColor: '#FFFFFF',
      width: '100%',
      border: '1px solid red',
      borderRadius: '0.3rem',
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: '1px solid',
        borderRadius: '0.3rem',
      },
    },
    buttonClass: {
      '.MuiIconButton-root MuiButtonBase-root': {
        padding: '0',
      },
    },
  })
)

const StudyOrder = ({
  remoteMode = false,
  appointment,
}: {
  remoteMode?: boolean
  appointment?: AppointmentWithPatient
}) => {
  const { addToast } = useToasts()
  const classes = useStyles()
  const { orders, setOrders, setIndexOrder } = useContext(CategoriesContext)
  const [show, setShow] = useState(false)
  const [encounter, setEncounter] = useState<Boldo.Encounter>(null)
  const [loading, setLoading] = useState(false)
  //orders list
  const [orderList, setOrderList] = useState<Boldo.OrderStudy[]>([])
  const [loadingOrdersList, setLoadingOrdersList] = useState(false)

  // error types when sending -> category + orderId | diagnosis + orderId | studies + orderId
  const [errorType, setErrorType] = useState('')
  // boolean handling the hover event
  const [showTooltipInfo, setShowTooltipInfo] = useState(false)
  const { Organization } = useContext(OrganizationContext)

  let matchInperson = useRouteMatch<{ id: string }>(`/appointments/:id/inperson`)
  let matchCall = useRouteMatch<{ id: string }>(`/appointments/:id/call`)

  const scrollToBy = (id: string) => {
    let scrollDiv = document.getElementById(id).offsetTop - 150
    document.getElementById('study_orders').scrollTo({ top: scrollDiv, behavior: 'smooth' })
  }

  //disabled form
  const [disabledStatus, setDisabledStatus] = useState(true)
  const [messageStatus, setMessageStatus] = useState('')

  const loadOrderList = async () => {
    setLoadingOrdersList(true)
    getStudyOrdersByEncounter(encounter.id, encounter.patientId)
      .then(res => setOrderList(res.data))
      .catch(err => {
        if (err?.response?.status === 404) {
          console.log('error')
          setOrderList([])
        } else {
          addToast({
            type: 'error',
            title: '¡Ocurrió un error!',
            text: 'Error inesperado al obtener la lista órdenes generadas en la cita.',
          })
        }
      })
      .finally(() => {
        setLoadingOrdersList(false)
      })
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const id = remoteMode ? matchCall?.params.id : matchInperson?.params.id
      const url = `/profile/doctor/appointments/${id}/encounter`
      try {
        setLoading(true)
        const res = await axios.get(url)
        if (mounted) setEncounter(res.data.encounter)
      } catch (err) {
        const tags = {
          endpoint: url,
          method: 'GET',
          appointment_id: id,
        }
        handleSendSentry(err, ERROR_HEADERS.ENCOUNTER.FAILURE_GET_IN_STUDY_ORDER, tags)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se pudieron cargar algunos detalles. ¡Inténtelo nuevamente más tarde!',
        })
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (orders.length === 1) {
      if (disabledStatus) return
      if (orders[0].diagnosis === '') {
        orders[0].diagnosis = encounter?.soep?.evaluation ?? ''
      }
      setOrders([...orders])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounter])

  useEffect(() => {
    if (!encounter) return
    loadOrderList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encounter])

  useEffect(() => {
    const status = appointment?.status ?? undefined
    switch (status) {
      case 'open' || 'closed':
        setDisabledStatus(false)
        setMessageStatus('')
        break
      case 'locked':
        setDisabledStatus(true)
        setMessageStatus('* ¡No disponible en citas finalizadas!')
        break
      case 'upcoming':
        setDisabledStatus(true)
        setMessageStatus('* ¡La cita aún no ha empezado!')
        break
      default:
        setDisabledStatus(true)
        setMessageStatus('')
    }
  }, [appointment])

  const addCategory = () => {
    setOrders([
      ...orders,
      {
        id: orders[orders.length - 1].id + 1,
        category: '',
        urgent: false,
        diagnosis: encounter?.soep?.evaluation ?? '',
        studies_codes: [] as Array<StudiesWithIndication>,
        notes: '',
      },
    ])
  }

  const deleteCategory = key => {
    if (orders.length > 1) {
      let update = [...orders]
      update.splice(key, 1)
      setOrders([...update])
    }
    //console.table(update)
  }

  const validateOrders = (orders: Array<Orders>) => {
    setErrorType('')
    for (let i = 0; i < orders.length; i++) {
      let order = orders[i]
      if (order.category === '') {
        addToast({ type: 'warning', title: '¡Advertencia!', text: 'Seleccione una categoría.' })
        scrollToBy(order.id.toString())
        setErrorType('category' + order.id)
        return false
      } else if (order.diagnosis === '') {
        addToast({ type: 'warning', title: '¡Advertencia!', text: 'La impresión diagnóstica no puede quedar vacía.' })
        scrollToBy(order.id.toString())
        setErrorType('diagnosis' + order.id)
        return false
      } else if (order.studies_codes.length <= 0) {
        addToast({ type: 'warning', title: '¡Advertencia!', text: 'No se han seleccionado los estudios.' })
        scrollToBy(order.id.toString())
        setErrorType('studies' + order.id)
        return false
      }
    }
    return true
  }
  // functions to handle the mouse event
  const handleMouseEnter = () => {
    setShowTooltipInfo(true)
  }
  const handleMouseLeave = () => {
    setShowTooltipInfo(false)
  }

  const [sendStudyLoading, setSendStudyLoading] = useState(false)

  const sendOrderToServer = async () => {
    if (validateOrders(orders)) {
      orders.forEach(object => {
        object.encounterId = encounter.id
      })

      let ordersCopy = []
      orders.forEach((object, index) => {
        let studiesCodes = []
        object.studies_codes.forEach(studies => {
          studiesCodes.push({ display: studies.name, code: studies.id, notes: studies.indication })
        })
        ordersCopy.push({
          category: object.category,
          diagnosis: object.diagnosis,
          encounterId: object.encounterId,
          notes: object.notes,
          urgent: object.urgent,
          studiesCodes: studiesCodes,
          organizationId: Organization?.id ?? '',
        })
      })
      // console.log(ordersCopy)
      const url = `/profile/doctor/serviceRequest`
      try {
        setSendStudyLoading(true)
        let total = ordersCopy.length
        await axios.post(url, ordersCopy)
        //console.log('server response', res)
        setSendStudyLoading(false)
        //reset Orders
        setOrders([
          {
            id: 1,
            category: '',
            urgent: false,
            diagnosis: encounter?.soep?.evaluation ?? '',
            studies_codes: [] as Array<StudiesWithIndication>,
            notes: '',
          },
        ])
        setIndexOrder(0)
        addToast({
          type: 'success',
          title: 'Notificación',
          text:
            total > 1
              ? 'Las órdenes de estudio han sido guardadas correctamente'
              : 'La orden de estudio ha sido guardada correctamente',
        })
        loadOrderList()
      } catch (err) {
        const tags = {
          endpoint: url,
          method: 'POST',
        }
        handleSendSentry(err, ERROR_HEADERS.STUDY_ORDER.FAILURE_POST, tags)
        addToast({
          type: 'error',
          title: 'Ha ocurrido un error.',
          text: 'No se pudo generar la orden de estudios. ¡Inténtalo nuevamente más tarde!',
        })
        setSendStudyLoading(false)
      }
    }
  }

  return (
    <>
      {/* Container */}
      <div className='flex flex-col h-full w-full'>
        {/* content */}
        <div className={`flex flex-col flex-1 overflow-auto ${remoteMode ? 'scrollbar' : ''}`}>
          {!remoteMode && <h1 className='font-sans text-2xl px-6 pb-6'>Orden de estudios</h1>}
          {orders.map((item, index) => {
            return (
              <div
                key={item.id}
                id={item.id.toString()}
                className={`p-4 mb-5 rounded-xl relative ${remoteMode ? 'mx-2' : 'mx-6'}`}
                style={{ backgroundColor: '#F7FAFC', minWidth: '320px' }}
              >
                <FormControl className={classes.form}>
                  <Typography className='flex flex-row pl-2 w-full font-semibold text-red-600 text-xs'>
                    {messageStatus}
                  </Typography>
                  <Grid container>
                    {orders.length > 1 && (
                      <IconButton
                        aria-label='Eliminar'
                        style={{
                          padding: '3px',
                          margin: '0',
                          outline: 'none',
                          position: 'absolute',
                          right: '1px',
                        }}
                        onClick={() => deleteCategory(index)}
                      >
                        <TrashIcon title='Eliminar Orden'></TrashIcon>
                      </IconButton>
                    )}
                    <Grid item container direction='row' spacing={5}>
                      <Grid item xs={5}>
                        <SelectCategory
                          variant='outlined'
                          classes={classes}
                          index={index}
                          error={errorType === 'category' + item.id}
                          value={item.category}
                          disabled={loading || disabledStatus}
                        />
                      </Grid>
                      <Grid item xs={7}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <CheckOrder
                                checked={item.urgent}
                                index={index}
                                disabled={loading || disabledStatus}
                              ></CheckOrder>
                            }
                            label='Urgente'
                          />
                        </FormGroup>
                        <FormHelperText>
                          marque la opción si estos estudios requieren ser realizadas cuanto antes
                        </FormHelperText>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container direction='column'>
                    <Grid style={{ marginBottom: '1rem' }}>
                      <Typography variant='subtitle1'>Diagnóstico</Typography>
                      <InputText
                        name='diagnosis'
                        variant='outlined'
                        className={errorType === 'diagnosis' + item.id ? classes.textfieldError : classes.textFieldDiag}
                        index={index}
                        value={item.diagnosis}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <div className='flex flex-row flex-no-wrap'>
                                {showTooltipInfo && <HoverInfo />}
                                <InfoIcon onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                              </div>
                            </InputAdornment>
                          ),
                        }}
                        disabled={loading || disabledStatus}
                      />
                    </Grid>
                    <Grid style={{ marginBottom: '1rem' }}>
                      <Typography variant='subtitle1'>Estudios a realizar</Typography>
                      <BoxSelect
                        index={index}
                        show={show}
                        setShow={setShow}
                        style={{
                          border: errorType === 'studies' + item.id ? '1px solid red' : '1px solid #EDF2F7',
                          minHeight: '3rem',
                          backgroundColor: loading || disabledStatus ? '#f4f5f7' : '',
                        }}
                        disabled={loading || disabledStatus}
                      />
                    </Grid>
                    <Grid>
                      <Typography variant='subtitle1'>Observaciones</Typography>
                      <InputText
                        name='observation'
                        variant='outlined'
                        className={classes.textfield}
                        multiline
                        index={index}
                        value={item.notes}
                        disabled={loading || disabledStatus}
                      />
                    </Grid>
                  </Grid>
                </FormControl>
              </div>
            )
          })}
          <div className='flex flex-col items-end gap-2 px-4 mb-3'>
            <button
              className='btn focus:outline-none border-primary-600 border-2 w-24 px-3 py-1 rounded-lg text-primary-600 font-semibold flex flex-row disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
              onClick={() => addCategory()}
              disabled={loading || disabledStatus}
            >
              Agregar
              <span className='pt-2 mx-2'>
                <IconAdd />
              </span>
            </button>
          </div>
          <div className='flex flex-col items-center p-2' style={{ minWidth: '320px' }}>
            {true && (
              <>
                {loading || loadingOrdersList ? (
                  <SpinnerL />
                ) : (
                  orderList.length === 0 &&
                  orders.length === 1 && (
                    <span className='text-dark-cool'>Aún no se han generado órdenes de estudio en esta cita.</span>
                  )
                )}
                {orderList.length > 0 &&
                  orderList.map((order, index) => (
                    <DisoclureOrder key={'order-list-' + index} order={order} small={remoteMode} />
                  ))}
              </>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className='flex flex-row w-full justify-end py-4 '>
          <button
            className='mr-4 focus:outline-none rounded-md bg-primary-600 text-white font-medium h-10 w-20 p-1 flex flex-row justify-center items-center disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
            onClick={() => {
              sendOrderToServer()
            }}
            disabled={sendStudyLoading || loading || disabledStatus}
          >
            {sendStudyLoading ? <Spinner /> : 'Guardar'}
          </button>
        </div>
      </div>
      <StudiesTemplate show={show} setShow={setShow} size='xl5' remoteMode={remoteMode}></StudiesTemplate>
    </>
  )
}

export default StudyOrder
