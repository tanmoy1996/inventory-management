'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getEmployeeById, getEmployeeAttendanceById } from '@/store/slices/employee'
import { RootState } from '@/store'
import dayjs, { Dayjs } from 'dayjs'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import Badge from '@mui/material/Badge'
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton'

const initialValue = dayjs('2022-04-17')

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props

  const isSelected = !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0

  return (
    <Badge key={props.day.toString()} overlap="circular" badgeContent={isSelected ? '✅' : undefined}>
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  )
}

export default function AttendanceCalender() {
  const dispatch = useAppDispatch()
  const { employeeAttendance } = useAppSelector((state: RootState) => state.employee)
  const requestAbortController = useRef<AbortController | null>(null)
  const [highlightedDays, setHighlightedDays] = useState<number[]>([])

  useEffect(() => {
    let s = employeeAttendance.map((att) => new Date(att.date).getDate())
    setHighlightedDays(s)
    // abort request on unmount
    return () => requestAbortController.current?.abort()
  }, [employeeAttendance])

  useEffect(() => {
    if (employeeAttendance) {
      console.log('employeeAttendance: ', employeeAttendance)
    }
  }, [employeeAttendance])

  return (
    <Box className=" bg-white shadow rounded">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          readOnly
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}
        />
      </LocalizationProvider>
    </Box>
  )
}
