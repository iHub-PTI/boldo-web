import React from 'react';
import CalendarIcon from '../icons/upload-icons/CalendarIcon';
import moment from 'moment';
import { countDays } from '../../util/helpers';


type Props = {
  authoredDate: string;
}


const DateSection = (props: Props) => {
  const {authoredDate=''} = props;

  return(
    <div className='flex flex-col space-y-4'>
      <p className='font-semibold text-xs not-italic leading-4 text-gray-500'>Solicitado en fecha</p>
      <div className='flex flex-row items-center space-x-3'>
        {/* icon and date */}
        <div className='flex flex-row items-center space-x-2'>
          <CalendarIcon />
          <p className='font-normal text-sm not-italic leading-4'>{(moment(authoredDate)).format('DD/MM/YYYY')}</p>
        </div>
        {/* count days ago */}
        <p className='font-normal text-sm not-italic leading-4 text-gray-500'>{countDays(authoredDate) ?? 'No fue posible calcular'}</p>
      </div>
    </div>
  );
}


export default DateSection;