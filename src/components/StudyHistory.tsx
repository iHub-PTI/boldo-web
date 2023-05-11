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
import { ReactComponent as CalendarIcon } from "../assets/calendar-detail.svg"
import ImgIcon from './icons/studies-category/ImgIcon'


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
					<div className="flex flex-col w-80 px-4 py-2 overflow-y-auto scrollbar" style={{ height: 'calc(100vh - 380px)' }}>
						<CardStudy />
						<CardStudy />
						<CardStudy />
						<CardStudy />
						<CardStudy />
						<CardStudy />
					</div>
					<div className="flex flex-col px-4 py-2 gap-1" style={{ width: '406px' }}>
						<CardDetailStudy />
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

const CardDetailStudy = () => {
	return (
		<>
			{/* Order Header */}
			<div className='flex flex-col p-2 gap-1'>
				<h1 className='font-semibold text-gray-500 text-xs'>Orden</h1>
				{/* Doctor picture */}
				<div className='flex flex-row gap-4 w-64 h-11 items-center'>
					<DoctorPicture className='rounded-full' />
					{/* Doctor info */}
					<div className='flex flex-col'>
						<div className='text-cool-gray-700' style={{ lineHeight: '16px' }}>
							Dr. Mario Cabañas
						</div>
						{/* Specialty and organization */}
						<div className='flex flex-row gap-1'>
							<div className='text-xs' style={{ color: '#718096', lineHeight: '16px' }}>
								Cardiologo
							</div>
							<div className='text-xs' style={{ color: '#718096', lineHeight: '16px' }}>
								⦁
							</div>
							<div className='text-xs' style={{ color: '#718096', lineHeight: '16px' }}>
								Hospital los Ángeles
							</div>
						</div>
					</div>
				</div>
				<div className='flex flex-row justify-end' style={{ width: '374px' }}>
					<a href='#a' className='text-orange-dark border-b border-orange-dark focus:outline-none text-sm'>
						Ver consulta origen
					</a>
				</div>
				<div className='font-semibold text-gray-500 text-xs'>Solicitado en fecha</div>
				<div className='flex flex-row items-center'>
					<CalendarIcon />
					<div className='text-cool-gray-700' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
						10/11/2022
					</div>
					<div className='ml-2 text-gray-500'>
						hace 7 días
					</div>
				</div>
			</div>

			{/* Diagnosis */}
			<div className='flex flex-col gap-1'>
				<div className='text-primary-500'>
					Impresión diagnóstica
				</div>
				<div className='font-semibold' style={{ lineHeight: '16px', letterSpacing: '0.1px' }}>
					Hipertensión intracraneal idiopática
				</div>
			</div>

			{/* Requested studies */}
			<div className='flex flex-col gap-2 mt-3'>
				<div className='text-primary-500'>
					Estudios solicitados
				</div>
				<div className='flex flex-col p-2' style={{ border: '3px solid #F6F4F4', borderRadius: '16px' }}>
					{/* Header Study */}
					<div className='flex flex-row justify-between'>
						<div className='flex flex-row gap-2'>
							<ImgIcon width={18} height={18} />
							<div className='text-cool-gray-700 text-sm' style={{ lineHeight: '20px' }}>Imágenes</div>
						</div>
						<div className='flex flex-row justify-center' style={{ padding: '1px 6px', width: '54px', height: '18px', background: '#E8431F', borderRadius: '4px' }}>
							<span className='font-semibold text-white' style={{
								fontSize: '10px',
								lineHeight: '16px',
								letterSpacing: '0.5px'
							}}>urgente</span>
						</div>
					</div>
					{/* Body Study */}
					<div className='flex flex-row pt-1'>
						<ul className="list-disc list-inside ml-2 pt-2">
							<li className='text-cool-gray-700 text-sm'>Elemento 1</li>
							<li className='text-cool-gray-700 text-sm'>Elemento 2</li>
							<li className='text-cool-gray-700 text-sm'>Elemento 3</li>
						</ul>
					</div>
					{/* Observation */}
					<div className='flex flex-col mt-2'>
						<div className='text-sm text-cool-gray-700'>Observaciones:</div>
						<div className='text-sm text-cool-gray-700'>Paciente con diabetes</div>
					</div>
				</div>
			</div>
		</>
	)
}

const DoctorPicture = (props) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlnsXlink="http://www.w3.org/1999/xlink"
		width={44}
		height={44}
		fill="none"
		{...props}
	>
		<path fill="url(#a)" d="M0 0h44v44H0z" />
		<defs>
			<pattern
				id="a"
				width={1}
				height={1}
				patternContentUnits="objectBoundingBox"
			>
				<use xlinkHref="#b" transform="translate(-.25) scale(.00234)" />
			</pattern>
			<image
				xlinkHref="data:image/jpeg;base64,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"
				id="b"
				width={640}
				height={427}
			/>
		</defs>
	</svg>
)

export default StudyHistory