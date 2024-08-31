'use client'
import React from 'react'
import { Box } from '@mui/material'

interface LoaderProps {
  className: string
}

const BoxLoader = ({ className }: LoaderProps) => {
  return <Box className={`${className} bg-slate-300 animate-pulse`}></Box>
}

export default BoxLoader
