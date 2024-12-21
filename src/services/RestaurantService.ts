import { Restaurant } from "@/@types/restaurant";
import ApiService from "./ApiService";

export async function apiUpdateRestaurant(data: FormData) {
    return ApiService.fetchData<Restaurant, FormData>({
        url: `/restaurants`,
        method: 'put',
        data,
    })
}

export async function apiGetRestaurant() {
    return ApiService.fetchData<Restaurant>({
        url: `/restaurants/self`,
        method: 'get',
    })
}

export async function apiUpdateurl(data : {url : string}) {
    return ApiService.fetchData({
        url: '/restaurant/url',
        method: 'patch',
        data,
    })
}