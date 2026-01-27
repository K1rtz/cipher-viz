import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeStep: 0,
  currentStep: -1,
  keyRaw: "",
  highlightStep: -1,
  stepChange: false,
  matrixInfo:{
    rowsLen: 6,
    colsLen: 8,
    fakeColsLen: 8
  },
  plainText: '',
  hexText: '',
  cipherType: 'classic',
  visualStep: -1,
  engineSteps: [],
  currentMatrixValue: '',
}

const stepInfoSlice = createSlice({
  name: 'stepInfo',
  initialState,
  reducers: {
    setCurrentMatrixValue(state, action){
      state.currentMatrixValue = action.payload
    },
    setEngineSteps(state, action){
      state.engineSteps = action.payload
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
    }},
    setCipherType: (state, action)=> {{
      state.cipherType = action.payload
    }},
    setVisualStep: (state, action)=>{
      state.visualStep = action.payload
    },
    resetStepInfo: (state, action) => {
      // return initialState;
      state.activeStep = 0;
      state.currentStep = -1;
      state.keyRaw = "";
      state.highlightStep = -1;
      state.stepChange = false;
      state.plainText = '';
      state.hexText = '';
      state.cipherType = 'classic';
      state.visualStep = -1;
      state.engineSteps = [];
      state.currentMatrixValue = '';
    },

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
  setRowsLen,
  setColsLen,
  setFakeColsLen,
  setCipherType,
  setVisualStep,
  setEngineSteps,
  setCurrentMatrixValue,
  resetStepInfo
} = stepInfoSlice.actions

export default stepInfoSlice.reducer