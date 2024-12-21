export type order = {
    id?: string
    customerName?: string
    customerAddress?: string
    customerPhone?: string
    notes?: string
    totalPrice?: number
    status?: string
    orderType?: string
    tableNumber?: number
    shippingFees?: number
    restaurantId?: string
    products?: ProductOrder[]
    createdAt?: Date
}


export interface ProductOrder {
    name?: string
    details?: string
    image?: string
    price?: number
    calories?: number
    quantity?: number
}