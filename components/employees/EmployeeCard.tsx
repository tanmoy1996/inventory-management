'use client'
import React from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { Box, Typography } from '@mui/material'
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import Link from 'next/link'

interface EmployeeCardProps {
  employee: any
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  return (
    <Link href={`/employees/${employee._id}`}>
      <Box className="h-[270px] bg-white border text-center rounded p-4 shadow-lg">
        <img
          src={employee.imgPath}
          alt={employee.name}
          className="h-[100px] w-[100px] rounded-full mx-auto object-cover mb-4"
        />
        <Typography variant="h6" className="mb-2">
          {employee.name}
        </Typography>
        <a href={`tel:${employee.phoneNo} `} className="flex gap-2 justify-center text-secondary items-center mb-8">
          <LocalPhoneOutlinedIcon fontSize="small" />
          <Typography variant="subtitle2">{formatPhoneNumber(employee.phoneNo)}</Typography>
        </a>
        <Box className="flex gap-2 justify-center">
          {employee.skills?.map((skill: string, idx: number) => (
            <Typography key={idx} variant="body2" className="text-secondary rounded py-1 px-2 bg-slate-200">
              {skill}
            </Typography>
          ))}
        </Box>
      </Box>
    </Link>
  )
}

export default EmployeeCard
