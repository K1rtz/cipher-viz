import { configureStore } from '@reduxjs/toolkit'
import stepInfoReducer from './reducers/stepInfoReducer.js'

export default configureStore({
  reducer: {
    stepInfo: stepInfoReducer,
  },
})