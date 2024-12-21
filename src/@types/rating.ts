export interface Rate {
    id: string
    restaurantId: string
    rate: number
    name: string
    email: string
    phone: string
    comment?: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}

export type RateResponse = Rate[]

export interface RateStats {
    [key: string]: number
}

export interface RateStatsResponse {
    data: RateStats
}

export interface MenuEvaluation {
    id: string
    name: string
    email: string
    phone: string
    stars: number
    comment?: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
}