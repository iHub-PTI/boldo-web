import React from 'react'
import CardList from './medical-history/CardList';
import CardListWarning from './medical-history/CardListWarning';
import InputTextDate from './medical-history/InputTextDate';
import TableGynecology from './medical-history/TableGynecology';


const MedicalHistory = () => {

  return (
    <div className='flex justify-center items-center mb-10'>
      <div className='flex flex-col mx-auto pt-10 gap-5 ' style={{ width: '400px' }}>
        {/* Componente desde aca */}
        <div className='flex justify-start h-auto mb-1'>
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

          <div className='flex flex-col w-full pl-2 pr-1'>
            <CardListWarning title='Alergias y sensibilidades' dataList={[]} />
          </div>
          {/* Section pathology */}
          <div className='font-medium text-base w-full text-primary-500'>Patologías</div>
          <div className='flex flex-col w-full pl-2 pr-1 gap-1'>
            <CardList title={'Cardiopatías'} dataList={[]} />
            <CardList title={'Respiratorias'} dataList={[]} />
            <CardList title={'Digestivas'} dataList={[]} />
          </div>
        </div>
        <div className='flex flex-col w-full gap-7 mb-5'>
          {/* Section procedures */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-primary-500'>Procedimientos</div>}
            dataList={[]}
          />

          {/* Section Others */}
          <CardList
            TitleElement={() => <div className='font-medium text-base text-primary-500'>Otros</div>}
            dataList={[]}
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
            />
            <CardList
              TitleElement={() => <div className='font-medium text-base text-primary-500'>Otros</div>}
              dataList={[]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalHistory