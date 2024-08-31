import { useState, useEffect } from 'react'

import { Box, IconButton, Typography } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import MuiPagination from '@mui/material/Pagination'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Dialog from '../shared/Dialog'
import PortraitRoundedIcon from '@mui/icons-material/PortraitRounded'
import AddAttandanceForm from '../forms/addAttandanceForm'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { createAttendance } from '@/store/slices/attendance'
import { useAppDispatch } from '@/hooks'

// Use the plugin
dayjs.extend(customParseFormat)

interface EmployeeTableProps {
  handlePageChange: (page: number) => void
  page: number
  startDate: any
  endDate: any
  setStartDate: any
  setEndDate: any
}

function createData(employee: any, ...dates: any) {
  const attendance: any = {}
  dates.forEach((date: any) => {
    const originalDate = date
    const parsedDate = dayjs(originalDate, 'DD/MM/YYYY', true)
    const formattedDate = parsedDate.format('YYYY-MM-DD')

    const inputDate = dayjs(formattedDate).startOf('day')
    const currentDate = dayjs().startOf('day')

    const isAfter = inputDate.isAfter(currentDate)

    const daysPresent = employee.empAttendance
      ?.filter((att: any) => att.isPresent)
      ?.map((att: any) => {
        return dayjs(att.date).format('DD/MM/YYYY')
      })
    if (isAfter) {
      attendance[date] = null
    } else {
      attendance[date] = daysPresent.includes(date)
    }
  })
  return { name: employee.name, attendance }
}

function generateDates(startOfWeek: any, endOfWeek: any) {
  // Generate an array of dates from start to end of the week
  const weekDates = []
  let currentDate = startOfWeek
  while (currentDate.isBefore(endOfWeek)) {
    weekDates.push(currentDate.toDate().toLocaleString('en-GB').substring(0, 10))
    currentDate = currentDate.add(1, 'day')
  }
  return weekDates
}

const AttendanceTable = ({
  handlePageChange,
  page,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: EmployeeTableProps) => {
  const dispatch = useAppDispatch()

  const { status, attendance, totalPages } = useAppSelector((state: RootState) => state.attendance)

  const [rows, setRows] = useState<any>([])

  const [dates, setDates] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<any>(null)
  const [slectedDate, setSelectedDate] = useState<any>(null)
  const [attendanceDialog, setAttendanceDialog] = useState<boolean>(false)

  useEffect(() => {
    const weekDays = generateDates(startDate, endDate)
    setDates(weekDays)
  }, [startDate, endDate])

  useEffect(() => {
    if (attendance.length > 0) {
      const rows = attendance.map((att) => createData(att, ...dates))
      setRows(rows)
    } else {
      setRows([])
    }
  }, [attendance, dates])

  const handleClose = () => {
    setAttendanceDialog(false)
  }

  const handleSubmit1 = () => {
    const newRow = JSON.parse(JSON.stringify(rows))
    newRow[selectedIndex].attendance[slectedDate] = !newRow[selectedIndex].attendance[slectedDate]
    setRows(newRow)
  }

  const handleNextWeek = () => {
    setStartDate(startDate.endOf('week').add(1, 'day'))
    setEndDate(endDate.add(1, 'day').endOf('week'))
  }

  const handlePreviousWeek = () => {
    setStartDate(startDate.subtract(1, 'day').startOf('week'))
    setEndDate(endDate.startOf('week').subtract(1, 'day'))
  }

  const validationSchema = Yup.object().shape({
    project: Yup.string().required('Project is required'),
    workDone: Yup.string().required('Work Done is required'),
  })

  const formik = useFormik({
    initialValues: {
      project: '',
      workDone: '',
      date: '',
      employee: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const day = +slectedDate.split('/')[0]
      const month = +slectedDate.split('/')[1] - 1
      const year = +slectedDate.split('/')[2]

      const val = JSON.parse(JSON.stringify(values))
      val.employee = attendance[selectedIndex].employeeId
      val.date = new Date(year, month, day)

      await dispatch(createAttendance(val))
      formik.resetForm()
      handleClose()
    },
  })

  const { values, errors, touched, handleChange, handleSubmit } = formik
  const handleAttendanceChange = (index: number, date: string) => {
    setSelectedIndex(index)
    setSelectedDate(date)
    setAttendanceDialog(true)

    // This will toggle attendance for the employee at 'index' for the given 'date'
  }

  return (
    <>
      <Box className="flex gap-2 items-center ">
        <IconButton onClick={handlePreviousWeek}>
          <ChevronLeft />
        </IconButton>
        <Typography>
          {startDate.toDate().toLocaleString('en-GB').substring(0, 10)} -{' '}
          {endDate.toDate().toLocaleString('en-GB').substring(0, 10)}
        </Typography>
        <IconButton onClick={handleNextWeek}>
          <ChevronRight />
        </IconButton>
      </Box>
      {rows && rows.length > 0 && (
        <TableContainer className="bg-white rounded shadow">
          <Table className="min-w-[650px] bg-transparent" aria-label="attendance sheet">
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                {rows[0].attendance &&
                  Object.keys(rows[0].attendance).map((date, index) => <TableCell key={index}>{date}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row: any, rowIndex: any) => (
                <TableRow key={rowIndex}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  {Object.keys(row.attendance).map((date, dateIndex) => (
                    <TableCell
                      key={dateIndex}
                      onClick={() => handleAttendanceChange(rowIndex, date)}
                      style={{
                        cursor: 'pointer',
                        padding: '0 !important',
                      }}>
                      {row.attendance[date] != null && (
                        <Box
                          className="rounded shadow p-4 flex justify-center items-center"
                          sx={{ backgroundColor: row.attendance[date] ? '#BBF7D0' : '#FFFFF' }}>
                          {row.attendance[date] ? 'Present' : 'Absent'}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box className="mt-2 flex justify-center">
        {status !== 'loading' && attendance.length > 0 ? (
          <MuiPagination
            color="primary"
            // className={className}
            count={totalPages}
            page={page ?? 1}
            onChange={(event, newPage) => {
              handlePageChange(newPage)
            }}
          />
        ) : null}
      </Box>
      <Dialog
        open={attendanceDialog}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        loading={false}
        Icon={<PortraitRoundedIcon sx={{ fontSize: '42px', color: '#9155FD' }} />}
        titleText="Add Attendance"
        subtitleText="Please fill out this form to add new Attendance"
        submitText="Submit">
        <Box className="max-w-xl mx-auto w-[500px]">
          <AddAttandanceForm
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            setFieldValue={null}
          />
        </Box>
      </Dialog>
    </>
  )
}

export default AttendanceTable
