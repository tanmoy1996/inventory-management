import React, { ReactNode } from 'react'
import { Box } from '@mui/material'

interface Props {
  children: ReactNode
}

const AppContent: React.FC<Props> = ({ children }: Props) => {
  return <Box className="h-[calc(100%-65px)] pb-4">{children}</Box>
}

export default AppContent
