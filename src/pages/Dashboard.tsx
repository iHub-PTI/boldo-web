import React, { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'

import { useSocket } from '../components/hooks/sockets'
import Layout from '../components/Layout'

interface Room {
  users: string[]
  roomId: string
}

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>()
  const socket = useSocket()
  useEffect(() => {
    if (!socket) {
      return
    }

    const getWaitingRooms = async () => {
      socket.on('waitingRooms', (rooms: any) => {
        let arrayOfRooms = []
        let arrayOfRoomsWithUsers = []
        for (let room in rooms) {
          arrayOfRooms.push(room)
        }

        for (let room of arrayOfRooms) {
          arrayOfRoomsWithUsers.push({ roomId: room, users: rooms[room] })
        }

        setRooms(arrayOfRoomsWithUsers)
      })
      socket.emit('addDoctorListening')
    }

    getWaitingRooms()
  }, [socket])
  // console.log(rooms)
  return (
    <Layout>
      <div className='m-6 lg:m-8'>
        <div className='max-w-5xl p-2 mx-auto'>
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
        <div className='mx-8 mt-8 '>
          <ul className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {rooms?.map(e => {
              if (!e.users.length) {
                return
              }
              return (
                <li className='col-span-1 bg-white rounded-lg shadow'>
                  <div className='flex items-center justify-between w-full p-6 space-x-6'>
                    <div className='flex-1 truncate'>
                      <div className='flex items-center space-x-3'>
                        <h3 className='text-sm font-medium leading-5 text-gray-900 truncate'>
                          Room Number: {e.roomId}
                        </h3>
                      </div>
                      <p className='mt-1 text-sm leading-5 text-gray-500 truncate'>Pations count: {e.users.length}</p>
                    </div>
                    <img
                      className='flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full'
                      src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
                      alt=''
                    />
                  </div>
                  <div className='border-t border-gray-200'>
                    <div className='flex -mt-px'>
                      <div className='flex flex-1 w-0 -ml-px'>
                        <div
                          onClick={() => {
                            window.location.href = `/call?room=${e.roomId}`
                          }}
                          className='relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out border border-transparent rounded-br-lg cursor-pointer hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10'
                        >
                          {/* Heroicon name: phone */}
                          <svg className='w-5 h-5 text-gray-400' viewBox='0 0 20 20' fill='currentColor'>
                            <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                          </svg>
                          <span className='ml-3'>Join Call</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </Layout>
  )
}
