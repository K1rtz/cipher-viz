import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeStep: 0,
  plainText: '',
  rowKey: '',
  columnKey: '',
  nextSubstepSignal: false,
  rowsInfo:{
    substeps: [],
    currentStep: 0,
  },
  columnsInfo:{
    substeps: [],
    currentStep: 0,
  }
}

const stepInfoSlice = createSlice({
  name: 'stepInfo',
  initialState,
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload
    },
    setPlainText: (state, action) => {{
      state.plainText = action.payload
    }},
    setRowKey: (state, action) => {
      state.rowKey = action.payload
    },
    setColumnKey: (state, action) => {
      state.columnKey = action.payload
    },
    setNextSubstepSignal: (state, action) => {
      state.nextSubstepSignal = action.payload
    },
    setRowsInfo: (state, action) => {
      state.rowsInfo = action.payload
    },
    setRowsSubsteps: (state, action) => {
      state.rowsInfo.substeps = action.payload
    },
    setRowsCurrentStep: (state, action) => {
      state.rowsInfo.currentStep = action.payload
    },
    setColumnsInfo: (state, action) => {
      state.columnsInfo = action.payload
    }
  }
})

export const {
  setActiveStep,
  setPlainText,
  setRowKey,
  setColumnKey,
  setNextSubstepSignal,
  setRowsSubsteps,
  setRowsCurrentStep,
} = stepInfoSlice.actions

export default stepInfoSlice.reducer