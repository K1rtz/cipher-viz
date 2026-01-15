import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeStep: 0,
  currentStep: -1,
  keyRaw: "",
  highlightStep: -1,
  stepChange: false,
  matrixInfo:{
    rowsLen: 7,
    colsLen: 7,
  },
  plainText: '',
  hexText: ''
}

const stepInfoSlice = createSlice({
  name: 'stepInfo',
  initialState,
  reducers: {
    setHighlightStep(state, action) {
      state.highlightStep = action.payload
    },
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
    setHexText: (state, action)=> {{
      state.hexText = action.payload
    }}

  }
})

export const {
  setActiveStep,
  setPlainText,
  setKeyRaw,
  setCurrentStep,
  setStepChange,
  setHighlightStep,
  setHexText
} = stepInfoSlice.actions

export default stepInfoSlice.reducer