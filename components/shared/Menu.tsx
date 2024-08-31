import React, { FC, ReactElement, useState } from 'react'
import { Popper, Grow, Paper, ClickAwayListener } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface MenuProps {
  children: ReactElement
  anchorEl: HTMLElement | null
  setAnchorEl: (value: HTMLElement | null) => void
}

const Menu: FC<MenuProps> = ({ children, anchorEl, setAnchorEl }: Readonly<MenuProps>) => {
  const theme = useTheme()
  const open = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      placement="bottom-end"
      transition
      disablePortal
      sx={{ position: 'absolute', zIndex: 20 }}>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            marginTop: '8px',
            transformOrigin: 'center top',
          }}>
          <Paper sx={{ background: theme.palette.common.white }}>
            <ClickAwayListener onClickAway={handleClose}>{children}</ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

export default Menu
