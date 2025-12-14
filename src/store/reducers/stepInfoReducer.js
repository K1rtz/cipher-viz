import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeStep: 0,
}

const stepInfoSlice = createSlice({
  name: 'stepInfo',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload
    },}
})

export const {
  setActiveStep,
} = stepInfoSlice.actions

export default stepInfoSlice.reducer