import React, { useMemo } from 'react'

interface DateFormattedProps {
  start: string | Date
  end: string | Date
}

const DateFormatted = (props: DateFormattedProps) => {
  const date = useMemo(() => {
    const date = new Intl.DateTimeFormat('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date(props.start))

    const start = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(props.start))

    const end = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(props.end))

    return { date, start, end }
  }, [props.end, props.start])
  return (
    <>
      <span>{date.date}</span>
      <span>⋅</span>
      <span>
        {date.start} – {date.end}
      </span>
    </>
  )
}

export default DateFormatted
