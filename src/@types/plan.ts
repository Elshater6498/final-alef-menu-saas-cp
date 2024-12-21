import { Currency } from "./restaurant"

export interface PlanType {
  id?: string
  name?: string
  details?: string
  price?: number
  currency?: Currency
  duration?: number
  active?: boolean
  sort?: number
  permissions?: string[]
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  frontPermissions? : string[]
  features?: {
    ar : string[]
    en : string[]
  }
}