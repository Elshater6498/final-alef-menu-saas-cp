import { Product, ProductRespones } from "@/@types/product";
import ApiService from "./ApiService";

export async function apiGetProduct(id : string) {
    return ApiService.fetchData<ProductRespones>({
        url: `/products/self?categoryid=${id}`,
        method: 'get',
    })
}

export async function apiCreateProduct(data: FormData) {
    return ApiService.fetchData({
        url: '/products',
        method: 'post',
        data,
    })
}

export async function apiUpdateProduct(data: FormData , id:string) {
    return ApiService.fetchData({
        url: `/products/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteProduct(product: Product) {
    return ApiService.fetchData({
        url: `/products/${product.id}`,
        method: 'delete',
    })
}

export async function apiChangePostionProduct(
    data: { id: string; sort: number }[]
) {
    return ApiService.fetchData({
        url: `/products/sort`,
        method: 'patch',
        data,
    })
}