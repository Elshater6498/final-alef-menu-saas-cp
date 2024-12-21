import { PlanType } from "@/@types/plan";
import ApiService from "./ApiService";

export async function apiGetPlans() {
  return ApiService.fetchData<PlanType[]>({
      url: `/plans`,
      method: 'get',
  })
}

export async function apiCreatePlan(data: FormData) {
  return ApiService.fetchData({
      url: '/plans',
      method: 'post',
      data,
  })
}

export async function apiUpdatePlan(data: FormData , id :string) {
return ApiService.fetchData({
    url: `/plans/${id}`,
    method: 'put',
    data,
})
}

export async function apiDeletePlan(plan: PlanType) {
  return ApiService.fetchData({
      url: `/plans/${plan.id}`,
      method: 'delete',
  })
}