import { order } from "@/@types/order"
import ApiService from "./ApiService"

export async function apiGetOrder({
    status,
    from,
    to,
    orderType,
}: {
    status: string
    from: string
    to: string
    orderType?: string
}) {
    return ApiService.fetchData<order[]>({
        url: `/orders?status=${status}&from=${from}&to=${to}`,
        method: 'get',
    })
}

export async function apiUpdateOrder(data: FormData, id: string) {
    return ApiService.fetchData({
        url: `/orders/${id}`,
        method: 'put',
        data,
    })
}
