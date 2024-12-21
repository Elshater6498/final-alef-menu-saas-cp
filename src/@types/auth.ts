import { Restaurant } from "./restaurant"

export type SignInCredential = {
    email: string
    password: string
}

export interface SignInResponse {
    token: string
    user: User
}

export interface User {
    id?: string
    email?: string
    name?: string
    phone?: string
    active?: boolean
    verified?: boolean
    paid?: boolean
    dueDate?: Date
    role?: number
    planId?: string
    domain?: string
    permissions?: string[]
    created_at?: Date
    updated_at?: Date
    deletedAt?: null
    restaurantId?: string
    restaurant?: Restaurant
}



export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    userName: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}
