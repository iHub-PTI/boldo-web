import { Popover, Transition } from '@headlessui/react'
import React, { useState } from 'react'
import ArrowBackIOS from './icons/ArrowBack-ios'
import SearchIcon from './icons/SearchIcon'
import FilterListIcon from './icons/filter-icons/FilterListIcon'
import PersonIcon from './icons/filter-icons/PersonIcon'
import { toUpperLowerCase } from '../util/helpers'
import StethoscopeIcon from './icons/filter-icons/StethoscopeIcon'
import ArrowDownWardIcon from './icons/filter-icons/ArrowDownWardIcon'
import ArrowUpWardIcon from './icons/filter-icons/ArrowUpWardIcon'
import OrderWithIcon from './icons/filter-icons/OrderWithIcon'
import OrderWithoutIcon from './icons/filter-icons/OrderWithoutIcon'
import LabIcon from './icons/studies-category/LabIcon'
import useWindowDimensions from '../util/useWindowDimensions'


type Props = {
	show: boolean,
	setShow: (value: boolean) => void
	appointment: Boldo.Appointment & { doctor: iHub.Doctor } & { patient: iHub.Patient } & { organization: Boldo.Organization },
}

const StudyHistory: React.FC<Props> = ({
	show,
	setShow,
	appointment,
	...props
}) => {

	//current doctor
	let doctor = {
		id: appointment?.doctorId,
		name: appointment?.doctor.givenName.split(' ')[0],
		lastName: appointment?.doctor.familyName.split(' ')[0],
	}

	//states filters
	const [inputContent, setInputContent] = useState('')

	const { width: winWidth } = useWindowDimensions()

	return (
		<Transition
			show={show}
			enter="transition-opacity ease-linear duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity ease-linear duration-75"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div className='flex flex-col px-5 pt-5 w-full'>
				{/* Head */}
				<button
					className='flex flex-row items-center mb-2 h-11 max-w-max-content focus:outline-none'
					onClick={() => {
						setShow(false)
					}}
				>
					<ArrowBackIOS className='mr-3' /> <span className='text-primary-500'>regresar a consulta actual</span>
				</button>

				{/* title study history */}
				<div className='flex justify-start h-auto mb-1'>
					<div className='text-black font-bold text-2xl'>
						Listado de Estudios
						<div className='text-cool-gray-400 font-normal text-xl'>
							Estudios solicitados y resultados
						</div>
					</div>
				</div>

				{/* input search */}
				<div className='flex flex-row gap-2 items-center'>
					{/* input search */}
					<div className='w-64 h-auto relative bg-cool-gray-50 rounded-lg mb-5 mt-5'>
						<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
							<SearchIcon className='w-5 h-5' />
						</div>
						<input
							className='p-3 pl-10 w-full outline-none hover:bg-cool-gray-100 transition-colors delay-200 rounded-lg'
							type='search'
							name='search'
							placeholder='Busqueda de estudios'
							title='Escriba aquí'
							autoComplete='off'
							value={inputContent}
							onChange={e => {
								setInputContent(e.target.value)
								//debounce(e.target.value.trim())
							}}
						/>
					</div>
					<QueryFilter
						currentDoctor={doctor}
					// setFilterAuthor={setFilterDoctor}
					// setOrder={setFilterOrder}
					// getApiCall={getRecordsPatient}
					// inputContent={inputContent}
					// countPage={countPage}
					/>
				</div>
				{/* body */}
				<div className='flex flex-row w-full'>
					<div className="flex flex-col w-80 px-4 py-2 overflow-y-auto" style={{ height: 'calc(100vh - 380px)' }}>
						<CardStudy />
						<CardStudy />
						<CardStudy />
						<CardStudy />
						<CardStudy />
						<CardStudy />
					</div>
					<div className="flex flex-col px-4 py-2 flex-1">
						
					</div>
				</div>
			</div>

		</Transition>
	)
}

export const QueryFilter = ({
	currentDoctor = {} as { id: string; name: string; lastName: string },
	// setFilterAuthor,
	// setOrder,
	// getApiCall,
	// inputContent,
	// countPage,
	// activeColor = false
}) => {
	//Current Doctor or all Doctors [ 'all' || 'current' ]
	const [author, setAuthor] = useState('ALL')
	//Asc or Desc [ 'asc' || 'desc' ]
	const [sequence, setSequence] = useState('DESC')
	//
	const [orderStudy, setOrderStudy] = useState('WITH_ORDER')

	const ORDER_STATE = {
		order: 'WITH_ORDER' === orderStudy,
		withoutOrder: 'WITHOUT_ORDER' === orderStudy,
	}

	const AUTHOR_STATE = {
		current: 'CURRENT' === author,
		all: 'ALL' === author,
	}

	const SEQUENCE_STATE = {
		asc: 'ASC' === sequence,
		desc: 'DESC' === sequence,
	}

	const onClickWithOrder = () => {
		setOrderStudy('WITH_ORDER')
	}

	const onClickWithoutOrder = () => {
		setOrderStudy('WITHOUT_ORDER')
	}

	const onClickCurrentDoctor = () => {
		setAuthor('CURRENT')
		// getApiCall({
		//   doctorId: 'CURRENT',
		//   content: inputContent,
		//   count: countPage,
		//   offset: 1,
		//   order: sequence,
		// })
	}

	const onClickAllDoctor = () => {
		setAuthor('ALL')
		// getApiCall({
		//   doctorId: 'ALL',
		//   content: inputContent,
		//   count: countPage,
		//   offset: 1,
		//   order: sequence,
		// })
	}

	const onClickSequenceAsc = () => {
		setSequence('ASC')
		// console.log(author)
		// getApiCall({
		//   doctorId: author,
		//   content: inputContent,
		//   count: countPage,
		//   offset: 1,
		//   order: 'ASC',
		// })
	}

	const onClickSequenceDesc = () => {
		setSequence('DESC')
		// console.log(author)
		// getApiCall({
		//   doctorId: author,
		//   content: inputContent,
		//   count: countPage,
		//   offset: 1,
		//   order: 'DESC',
		// })
	}

	// useEffect(() => {
	//   setOrder(sequence)
	//   setFilterAuthor(author)
	//   // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [sequence, author])

	return (
		<Popover className='relative'>
			{({ open }) => (
				/* Use the `open` state to conditionally change the direction of the chevron icon. */
				<>
					<Popover.Button className='focus:outline-none' title='Filtros'>
						<FilterListIcon active={open} />
					</Popover.Button>
					<Popover.Panel className='absolute left-10 z-10 mt-3 -translate-x-1/2 transform px-4 w-72'>
						<div
							className='flex flex-col bg-blue-100 p-3 rounded-2xl shadow-xl gap-3'
							style={{ backgroundColor: '#EDF2F7' }}
						>
							<div className='flex flex-col'>
								<div className='font-semibold text-gray-500 mb-1'>Estudio Subido</div>
								<div className='flex flex-col w-full mb-2'>
									<button
										className={`flex flex-row items-center gap-2 cursor-pointer ${ORDER_STATE['order'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
											} p-3 rounded-t-2xl focus:outline-none`}
										onClick={() => onClickWithOrder()}
									>
										<OrderWithIcon className='mr-1' active={ORDER_STATE['order']} />
										<div className={`font-semibold ${ORDER_STATE['order'] && 'text-primary-500'}`}>
											Con orden asociado
										</div>
									</button>
									<button
										className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${ORDER_STATE['withoutOrder'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
											} p-3 rounded-b-2xl`}
										onClick={() => onClickWithoutOrder()}
									>
										<OrderWithoutIcon className='mr-1' active={ORDER_STATE['withoutOrder']} />
										<div className={`font-semibold ${ORDER_STATE['withoutOrder'] && 'text-primary-500'}`}>
											Sin orden asociada
										</div>
									</button>
								</div>
								<div className='font-semibold text-gray-500 mb-1'>Autor</div>
								<div className='flex flex-col w-full mb-2'>
									<button
										className={`flex flex-row items-center gap-2 cursor-pointer ${AUTHOR_STATE['current'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
											} p-3 rounded-t-2xl focus:outline-none`}
										onClick={() => onClickCurrentDoctor()}
									>
										<PersonIcon className='mr-1' active={AUTHOR_STATE['current']} />
										<div className={`font-semibold ${AUTHOR_STATE['current'] && 'text-primary-500'}`}>
											{toUpperLowerCase(currentDoctor.name + ' ' + currentDoctor.lastName)}
										</div>
									</button>
									<button
										className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${AUTHOR_STATE['all'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
											} p-3 rounded-b-2xl`}
										onClick={() => onClickAllDoctor()}
									>
										<StethoscopeIcon className='mr-1' active={AUTHOR_STATE['all']} />
										<div className={`font-semibold ${AUTHOR_STATE['all'] && 'text-primary-500'}`}>
											Todos los médicos
										</div>
									</button>
								</div>
								<div className='font-semibold text-gray-500 mb-1'>Orden</div>
								<div className='flex flex-col w-full mb-2'>
									<button
										className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['desc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
											} p-3 rounded-t-2xl`}
										onClick={() => onClickSequenceDesc()}
									>
										<ArrowDownWardIcon className='mr-1' active={SEQUENCE_STATE['desc']} />
										<div className={`font-semibold ${SEQUENCE_STATE['desc'] && 'text-primary-500'}`}>
											Nuevos Primero
										</div>
									</button>
									<button
										className={`flex flex-row items-center gap-2 cursor-pointer focus:outline-none ${SEQUENCE_STATE['asc'] ? 'bg-primary-100' : 'bg-white hover:bg-gray-100'
											} p-3 rounded-b-2xl`}
										onClick={() => onClickSequenceAsc()}
									>
										<ArrowUpWardIcon className='mr-1' active={SEQUENCE_STATE['asc']} />
										<div className={`font-semibold ${SEQUENCE_STATE['asc'] && 'text-primary-500'}`}>
											Antiguos Primero
										</div>
									</button>
								</div>
							</div>
						</div>
					</Popover.Panel>
				</>
			)}
		</Popover>
	)
}


const CardStudy = () => {
	return (
		<div className='flex flex-col p-2 group hover:bg-neutral-gray rounded-lg'
			style={{
				width: '250px',
				height: '171px',
				gap: '10px',
				transition: 'background-color 0.3s ease-out',
				cursor: 'pointer'
			}}
		>
			{/* Head */}
			<div className='flex flex-row items-center gap-2'>
				<LabIcon width={27} height={27} />
				<h2 className='text-cool-gray-700 font-normal'
					style={{ fontSize: '20px' }}
				>Laboratorio</h2>
			</div>
			{/* Studies added */}
			<div className='flex flex-row px-1 py-2 text-dark-cool text-sm bg-ghost-white group-hover:bg-primary-100 group-hover:text-green-darker items-center' style={{
				width: '164px',
				height: '26px',
				borderRadius: '1000px',
				lineHeight: '16px',
				letterSpacing: '0.1px',
				transition: 'background-color 0.3s ease-out, color 0.3s ease-out'

			}}>
				2 Resultados añadidos
			</div>

			{/* study container*/}
			<div className='flex flex-col gap-1 w-56'>
				<div className='w-56 truncate text-dark-cool font-semibold text-sm'
					style={{
						lineHeight: '16px',
						letterSpacing: '0.1px'
					}}
					title='Hemograma completo, glucosa asdasdasd'
				>
					Hemograma completo, glucosa asdasdasd
				</div>
				<div className='w-56 truncate font-normal text-xs text-dark-cool'
					style={{
						lineHeight: '16px',
						letterSpacing: '0.1px'
					}}
					title='Solicitado por el Dr. Mario Cabañas'
				>
					Solicitado por el Dr. Mario Cabañas
				</div>
			</div>

			{/* Footer */}
			<div className='flex flex-row gap-2 h-4'>
				<div className='text-dark-cool text-sm '
					style={{
						lineHeight: '16px',
						letterSpacing: '0.1px'
					}}
				>
					10/11/2022
				</div>
				<div className='text-gray-500'
					style={{
						lineHeight: '16px',
						letterSpacing: '0.1px'
					}}
				>
					Hace 7 días
				</div>
			</div>
			<span style={{ borderBottom: '2px solid #F7F4F4' }}></span>
		</div>
	)
}

export default StudyHistory