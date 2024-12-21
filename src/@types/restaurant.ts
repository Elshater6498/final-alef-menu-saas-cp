export interface Restaurant {
    id?: string
    name?: string
    details?: string
    address?: string
    image?: string
    cover?: string
    detailsImage?: string
    theme?: string
    phone?: string
    whatsapp?: string
    date?: DateElement[]
    url?: string
    defaultLanguage?: string
    tables?: number
    UserID?: string
    currency?: Currency
    avgRate?: number
    shippingFees?: number
    taxService?: string
    slogan?: string
    active?: boolean
    showDates?: boolean
    takeaway?: boolean
    delivery?: boolean
    inRestaurant?: boolean
    showRates?: boolean
    socialMedia?: SocialMedia[]
    createdAt?: Date
    updatedAt?: Date
    deletedAt?: Date
}

type SocialMedia = {
    value?: string
    key? :string
}

export interface Currency {
    name?: string
    enName?: string
    iso3?: string
}
type DateElement = {
    day?: number
    openedFrom?: string
    openedTo?: string
    off?: boolean
}
