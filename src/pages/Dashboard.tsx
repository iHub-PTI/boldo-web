import React from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'

import Layout from '../components/Layout'

interface Room {
  users: string[]
  roomId: string
}

export default function Dashboard() {
  return (
    <Layout>
      <div className='m-6 lg:m-8'>
        <div className='max-w-5xl p-2'>
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
            initialView='timeGridWeek'
            nowIndicator={true}
            locale={esLocale}
            dayHeaderFormat={{ weekday: 'long', day: 'numeric', omitCommas: true }}
            dayHeaderContent={({ text, isToday }) => {
              const [weekday, day] = text.split(' ')
              return (
                <div
                  className={
                    'flex flex-col font-medium leading-tight uppercase ' +
                    (isToday ? 'text-primary-500' : 'text-gray-500')
                  }
                >
                  <span className='text-xs'>{weekday}</span>
                  <span className='text-3xl'>{day}</span>
                </div>
              )
            }}
            headerToolbar={{
              start: 'title prev,next today',
              center: '',
              end: 'dayGridMonth,timeGridWeek,timeGridThreeDay,listWeek',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            views={{
              timeGridThreeDay: {
                type: 'timeGrid',
                duration: { days: 3 },
                buttonText: '3 day',
              },
            }}
          />
        </div>
      </div>
    </Layout>
  )
}
