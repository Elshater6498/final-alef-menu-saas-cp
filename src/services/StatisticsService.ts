import ApiService from "./ApiService";
import { StatisticsType } from "@/@types/statistics";

export async function apiGetStatistics(
  language: string
) {
  return ApiService.fetchData<StatisticsType>({
      url: `/statistics`,
      method: 'get',
      headers: {
        'language': language
      }
  })
}