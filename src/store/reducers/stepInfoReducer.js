import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeStep: 0,
  currentStep: 0,
  keyRaw: "",
  stepChange: false,
  matrixInfo:{
    rowsLen: 7,
    colsLen: 7,
  },
  plainText: '',
  rowKey: '',
  columnKey: '',
  rowsInfo:{
    substeps: [],
    currentStep: 0,
    advanceNext: false,
  },
  columnsInfo:{
    substeps: [],
    currentStep: 0,
    advanceNext: false,
  }
}

const stepInfoSlice = createSlice({
  name: 'stepInfo',
  initialState,
  reducers: {
    setStepChange: (state, action) => {
      state.stepChange = action.payload
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    setKeyRaw: (state, action) => {
      state.keyRaw = action.payload
    },
    setRowsLen: (state, action) => {
      state.matrixInfo.rowsLen = action.payload.rowsLen;
    },
    setColsLen: (state, action) => {
      state.matrixInfo.colsLen = action.payload.colsLen;
    },
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
    setColumnsCurrentStep: (state, action) => {
      state.columnsInfo.currentStep = action.payload
    },
    setColumnsInfo: (state, action) => {
      state.columnsInfo = action.payload
    },
    setColumnsSubsteps: (state, action) => {
      state.columnsInfo.substeps = action.payload
    },
    setRowsAdvanceNext: (state, action) => {
      state.rowsInfo.advanceNext = action.payload
    },
    setColumnsAdvanceNext: (state, action) => {
      state.columnsInfo.advanceNext = action.payload
    }

  }
})

export const {
  setActiveStep,
  setPlainText,
  setRowKey,
  setColumnKey,
  setColumnsCurrentStep,
  setNextSubstepSignal,
  setRowsSubsteps,
  setRowsCurrentStep,
  setRowsAdvanceNext,
  setColumnsAdvanceNext,
  setColumnsSubsteps,
  setColsLen,
  setRowsLen,
  setKeyRaw,
  setCurrentStep,
  setStepChange
} = stepInfoSlice.actions

export default stepInfoSlice.reducer