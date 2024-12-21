import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'
import { Restaurant } from '@/@types/restaurant'


const initialState: Restaurant = {
    id: '',
    name: '',
    address: '',
    image: '',
    cover: '',
    theme: '',
    phone: '',
    whatsapp: '',
    url: '',
    tables: 0,
    socialMedia: [],
    date : [],
    slogan:"",
}

const restaurant = createSlice({
    name: `${SLICE_BASE_NAME}`,
    initialState,
    reducers: {
        setRestaurant(state, action: PayloadAction<Restaurant>) {
            state.id = action.payload?.id
            state.name = action.payload?.name
            state.address = action.payload?.address
            state.cover = action.payload?.cover
            state.image = action.payload?.image
            state.phone = action.payload?.phone
            state.whatsapp = action.payload?.whatsapp
            state.url = action.payload?.url
            state.theme = action.payload?.theme
            state.tables = action.payload?.tables
            state.createdAt = action.payload?.createdAt
            state.updatedAt = action.payload?.updatedAt
            state.socialMedia = action.payload?.socialMedia
            state.date = action.payload?.date
            state.detailsImage = action.payload?.detailsImage
            state.taxService = action.payload?.taxService
            state.currency = action.payload?.currency
            state.defaultLanguage = action.payload?.defaultLanguage
            state.avgRate = action.payload?.avgRate
            state.slogan = action.payload?.slogan
            state.showDates = action.payload?.showDates
            state.takeaway = action.payload?.takeaway
            state.delivery = action.payload?.delivery
            state.inRestaurant = action.payload?.inRestaurant
            state.details = action.payload?.details
            state.showRates = action.payload?.showRates
            state.shippingFees = action.payload?.shippingFees
        },
    },
})

export const { setRestaurant } = restaurant.actions
export default restaurant.reducer
