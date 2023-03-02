import React from 'react'
import { HEIGHT_BAR_STATE_APPOINTMENT, HEIGHT_NAVBAR, WIDTH_XL } from '../util/constants';
import useWindowDimensions from '../util/useWindowDimensions';
import CardList from './medical-history/CardList';
import CardListWarning from './medical-history/CardListWarning';
import TableGynecology from './medical-history/TableGynecology';

type Props = {
  show: boolean,
}

const MedicalHistory: React.FC<Props> = ({ show = false, ...props }) => {

  const { width: screenWidth } = useWindowDimensions()


  if (show) return (
    <div className='flex flex-col justify-center items-center overflow-y-auto' style={{ minWidth: '400px' }}>
      <div className='flex flex-col mx-auto gap-5'
        style={{
          height: ` ${screenWidth >= WIDTH_XL ? `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT}px)` : `calc(100vh - ${HEIGHT_BAR_STATE_APPOINTMENT + HEIGHT_NAVBAR}px)`}`
        }}>
        {/* Componente desde aca */}
        <div className='flex justify-start h-12 mb-1 pl-6'>
          <div className='text-black font-bold text-2xl'>
            Antecedentes clínicos
            <div className='text-cool-gray-400 font-normal text-xl'>
              personales y familiares
            </div>
          </div>
        </div>
        {/* Personal */}
        <div className='flex flex-col items-center w-full gap-3'>
          <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
            <span className='font-medium text-cool-gray-700 tracking-wide'>Personal</span>
          </div>

          <div className='flex flex-col w-full pl-6 pr-2'>
            <CardListWarning title='Alergias y sensibilidades' dataList={[]} />
          </div>
          {/* Section pathology */}
          <div className='flex flex-col w-full pl-8 pr-6'>
            <div className='font-medium text-base w-full text-primary-500'>Patologías</div>
            <div className='flex flex-col w-full pl-2 pr-1 gap-1'>
              <CardList title={'Cardiopatías'} dataList={[]} />
              <CardList title={'Respiratorias'} dataList={[]} />
              <CardList title={'Digestivas'} dataList={[]} />
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-7 mb-5 pl-3 pr-3'>
          {/* Section procedures */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-primary-500'>Procedimientos</div>}
            dataList={[]}
            inputTypeWith="date"
          />

          {/* Section Others */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-primary-500'>Otros</div>}
            dataList={[]}
            inputTypeWith="date"
          />
          {/* Section Gynecology */}
          <TableGynecology />
        </div>
        {/* Family Section */}
        <div className='flex flex-col items-center w-full gap-3'>
          <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
            <span className='font-medium text-cool-gray-700 tracking-wide'>Familiar</span>
          </div>
          <div className='flex flex-col w-full pl-2 pr-1 gap-1 mt-5'>
            <CardList
              TitleElement={() => <div className='font-medium text-base text-primary-500'>Enfermedades hereditarias</div>}
              dataList={[]}
              inputTypeWith='description'
            />
            <CardList
              TitleElement={() => <div className='font-medium text-base text-primary-500'>Otros</div>}
              dataList={[]}
              inputTypeWith="date"
            />
          </div>
        </div>
      </div>
    </div>
  )
  return null
}

export default MedicalHistory