// Store where we will store the global state of the application
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

// Type of Global slice state
interface GlobalStateTypes {
  navBarDesktopMini: boolean
  navBarMobileClosing: boolean
  navBarMobileOpen: boolean
}

// Initial state using that type
const initialState: GlobalStateTypes = {
  navBarDesktopMini: true,
  navBarMobileClosing: false,
  navBarMobileOpen: false,
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setNavBarDesktopMini: (state, action: PayloadAction<boolean>) => {
      state.navBarDesktopMini = action.payload
    },
    setNavBarMobileClosing: (state, action: PayloadAction<boolean>) => {
      state.navBarMobileClosing = action.payload
    },
    toggleNavbar: (state) => {
      state.navBarMobileOpen = !state.navBarMobileOpen
    },
    setNavBarMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.navBarMobileOpen = action.payload
    },
  },
})

export const { setNavBarDesktopMini, setNavBarMobileClosing, setNavBarMobileOpen, toggleNavbar } = globalSlice.actions

export default globalSlice.reducer
