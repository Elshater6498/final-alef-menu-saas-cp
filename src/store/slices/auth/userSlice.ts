import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export type UserState = {
  id?:                string;
  email?:             string;
  name?:              string;
  phone?:             string;
  country?:           string;
  city?:              string;
  notes?:             string;
  responsiblePerson?: string;
  planPrice?:         number;
  active?:            boolean;
  verified?:          boolean;
  paid?:              boolean;
  dueDate?:           Date;
  role?:              number;
  duration?:          number;
  domain?:            string;
  permissions?:       string[];
  created_at?:        Date;
  updated_at?:        Date;
  deletedAt?:         null;
  restaurantId?:      string;
  authority?: string[]
}

const initialState: UserState = {
    id: '',
    email: '',
    name: '',
    phone: '',
    active: false,
    verified: false,
    paid: false,
    role: 0,
    domain: '',
    permissions: [],
    restaurantId: '',
    authority: [],
}

const userSlice = createSlice({
    name: `${SLICE_BASE_NAME}/user`,
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserState>) {
            state.id = action.payload?.id
            state.email = action.payload?.email
            state.name = action.payload?.name
            state.phone = action.payload?.phone
            state.active = action.payload?.active
            state.verified = action.payload?.verified
            state.paid = action.payload?.paid
            state.role = action.payload?.role
            state.domain = action.payload?.domain
            state.permissions = action.payload?.permissions
            state.created_at = action.payload?.created_at
            state.updated_at = action.payload?.updated_at
            state.deletedAt = action.payload?.deletedAt
            state.dueDate = action.payload?.dueDate
            state.restaurantId = action.payload?.restaurantId
            state.authority = action.payload?.authority
        },
    },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
