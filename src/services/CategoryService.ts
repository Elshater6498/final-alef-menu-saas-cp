import { Category, CategoryResponse } from "@/@types/category";
import ApiService from "./ApiService";


export async function apiGetCategory(restaurantId:string) {
    return ApiService.fetchData<CategoryResponse>({
        url: `/categories/self?restaurantId=${restaurantId}`,
        method: 'get',
    })
}

export async function apiCreateCategory(data: FormData) {
    return ApiService.fetchData({
        url: '/categories',
        method: 'post',
        data,
    })
}

export async function apiUpdateCategory(data: FormData , id :string) {
    return ApiService.fetchData({
        url: `/categories/${id}`,
        method: 'put',
        data,
    })
}
export async function apiDeleteCategory(data: Category) {
    return ApiService.fetchData({
        url: `/categories/${data.id}`,
        method: 'delete',
    })
}

export async function apiChangePostionCategory(
    data: { id: string ; sort: number }[]
) {
    return ApiService.fetchData({
        url: `/categories/sort`,
        method: 'patch',
        data,
    })
}