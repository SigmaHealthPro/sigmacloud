import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface inventoryInfo{
  value: any
}

const initialState: inventoryInfo = {
  value: 0,
}

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setInventory: (state, action: PayloadAction<any>) => {
      
      state.value = action.payload
    },
  },
})


// Action creators are generated for each case reducer function
export const {  setInventory } = inventorySlice.actions

export default inventorySlice.reducer