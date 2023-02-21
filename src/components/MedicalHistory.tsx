import React from 'react'
import CardList from './medical-history/CardList';
import CardListWarning from './medical-history/CardListWarning';
import InputTextDate from './medical-history/InputTextDate';
import TableGynecology from './medical-history/TableGynecology';


const MedicalHistory = () => {
  
  //const allergies = [{ name: 'Arritmia' }, { name: 'Ibuprofeno' }, { name: 'Látex' }]
  //const cardio = [{ name: 'prueba' }, { name: 'prueba' }, { name: 'prueba' }]
  
  return (
    <div className='flex justify-center items-center'>
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
        <div className='flex flex-col items-center w-full gap-5'>
          <div className='flex flew-row flex-no-wrap w-full border-l-4 h-10 px-6 items-center rounded-r-md' style={{ backgroundColor: '#f7f4f4', borderColor: '#ABAFB6' }}>
            <span className='font-medium text-cool-gray-700 tracking-wide'>Personal</span>
          </div>

          <div className='flex flex-col w-full pl-2 pr-1'>
            <CardListWarning title='Alergias y sensibilidades' dataList={[]} />
          </div>
          <div className='flex flex-col w-full pl-2 pr-1'>
            <CardList title={'Cardiopatías'} dataList={[]} />
          </div>
        </div>
        {/* <TableGynecology /> */}
        <InputTextDate show={true}/>
      </div>
    </div>
  )
}

export default MedicalHistory