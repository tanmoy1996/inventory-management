import { useEffect } from 'react'
import { Box } from '@mui/material'
import { useAppSelector } from '@/hooks'
import { RootState } from '@/store'
import EmployeeCard from './EmployeeCard'
import { useOnScreen } from '@/hooks'
import BoxLoader from '../shared/BoxLoader'

interface EmployeeTableProps {
  handlePageChange: (page: number) => void
}

export default function EmployeeTable({ handlePageChange }: EmployeeTableProps) {
  const { status, employees, totalPages, page } = useAppSelector((state: RootState) => state.employee)

  const [ref, isVisible] = useOnScreen()

  useEffect(() => {
    if (isVisible) {
      console.log('isVisible: ', isVisible, totalPages, page)
      if (!totalPages || totalPages > page) handlePageChange(page + 1)
    }
  }, [isVisible])

  return (
    <>
      <Box className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-2">
        {employees.map((emp) => (
          <EmployeeCard employee={emp} key={emp._id} />
        ))}
        {status == 'loading' && (
          <>
            <BoxLoader className="h-[270px] w-full rounded" />
            <BoxLoader className="h-[270px] w-full rounded" />
            <BoxLoader className="h-[270px] w-full rounded" />
          </>
        )}
      </Box>
      <Box ref={ref as any}></Box>
    </>
  )
}
