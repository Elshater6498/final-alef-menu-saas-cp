import { MenuEvaluation, RateResponse, RateStatsResponse } from '@/@types/rating'
import ApiService from '@/services/ApiService'

export async function apiGetRates() {
    return ApiService.fetchData<RateResponse>({
        url: `/rates`,
        method: 'get',
    })
}

export async function apiGetRatesStats() {
    return ApiService.fetchData<RateStatsResponse>({
        url: `/rates/stats`,
        method: 'get',
    })
}

// Transform API response to MenuEvaluation format
export function transformRateToEvaluation(rates: RateResponse): MenuEvaluation[] {
    return rates.map(rate => ({
        id: rate.id,
        name: rate.name,
        email: rate.email,
        phone: rate.phone,
        stars: rate.rate,
        comment: rate.comment || '',
        createdAt: rate.createdAt,
        updatedAt: rate.updatedAt,
        deletedAt: rate.deletedAt
    }))
}