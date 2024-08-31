'use client'
import LoaderAnimation from '@/components/shared/Loader'
import { Box } from '@mui/material'

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Box className="h-full flex justify-center items-center">
      <LoaderAnimation />
    </Box>
  )
}
