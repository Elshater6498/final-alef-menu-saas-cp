import { combineReducers } from '@reduxjs/toolkit'
import restaurant from './restauranSlice'

const reducer = combineReducers({
    restaurant,
})

export * from './restauranSlice'

export default reducer
