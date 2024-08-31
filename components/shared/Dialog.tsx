import React, { ReactNode } from 'react'
import Button from '@mui/material/Button'
import Dialogbox from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import { IconButton, Typography, Paper } from '@mui/material'
import { useTheme } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'
import LoadingButton from '@mui/lab/LoadingButton'
interface Props {
  children: ReactNode
  Icon: ReactNode
  open: boolean
  submitText: string
  titleText: string
  subtitleText: string
  loading: boolean
  handleClose: () => void
  handleSubmit: any
}

const Dialog: React.FC<Props> = ({
  children,
  Icon,
  open,
  loading,
  submitText,
  titleText,
  subtitleText,
  handleClose,
  handleSubmit,
}: Props) => {
  const theme = useTheme()
  return (
    <Dialogbox open={open} onClose={handleClose}>
      <DialogTitle sx={{ padding: 0, borderBottom: `1px solid #cacaca` }} className="flex">
        <Box className="w-[80px] h-[80px] bg-primary/20 flex justify-center items-center">{Icon}</Box>
        <Box className="pl-4 my-auto grow">
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            {titleText}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
            {subtitleText}
          </Typography>
        </Box>
        <Box className="w-[50px] pt-3">
          <IconButton disabled={loading} onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ background: theme.palette.background.default }}>
        <Box className="py-4">{children}</Box>
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} sx={{ textTransform: 'capitalize' }} onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          disabled={loading}
          loading={loading}
          sx={{ textTransform: 'capitalize' }}
          onClick={handleSubmit}
          variant="contained"
          color="primary">
          {submitText}
        </LoadingButton>
      </DialogActions>
    </Dialogbox>
  )
}

export default Dialog
