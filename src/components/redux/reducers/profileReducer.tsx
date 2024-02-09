import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface userInfo{
  value: any
}

const initialState: userInfo = {
  value: 0,
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<any>) => {
      
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const {  setUserProfile } = profileSlice.actions

export default profileSlice.reducer