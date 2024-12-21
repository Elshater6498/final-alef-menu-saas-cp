import { PermissionsList, UserInfo, UserInfoResponse } from "@/@types/userInfo";
import ApiService from "./ApiService";


export async function apiGetUserByRole({role}:{role : number}) {
    return ApiService.fetchData<UserInfoResponse>({
        url: `/auth/users?role=${role}`,
        method: 'get',
    })
}

export async function apiGetPermissions() {
    return ApiService.fetchData<PermissionsList[]>({
        url: `/auth/permissions`,
        method: 'get',
    })
}



export async function apiCreateUser(data: FormData) {
    return ApiService.fetchData({
        url: '/auth/users',
        method: 'post',
        data,
    })
}

export async function apiUpdateUser(data: FormData , id :string) {
  return ApiService.fetchData({
      url: `/auth/users/${id}`,
      method: 'put',
      data,
  })
}