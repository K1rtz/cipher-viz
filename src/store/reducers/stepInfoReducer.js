import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeStep: 0,
  currentStep: -1,
  keyRaw: "",
  highlightStep: -1,
  stepChange: false,
  matrixInfo:{
    rowsLen: 6,
    colsLen: 9,
    fakeColsLen: 9
  },
  plainText: '',
  hexText: '',
  showHex: false,
}

const stepInfoSlice = createSlice({
  name: 'stepInfo',
  initialState,
  reducers: {
    setShowHex(state, action) {
      state.showHex = action.payload
    },
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
      state.matrixInfo.rowsLen = action.payload;
    },
    setColsLen: (state, action) => {
      state.matrixInfo.colsLen = action.payload;
    },
    setFakeColsLen: (state, action) =>{
      state.matrixInfo.fakeColsLen = action.payload;
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
  setHexText,
  setShowHex,
  setRowsLen,
  setColsLen,
  setFakeColsLen
} = stepInfoSlice.actions

export default stepInfoSlice.reducer