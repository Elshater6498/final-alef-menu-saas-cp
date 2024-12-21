import { apiGetRestaurant, apiUpdateRestaurant } from "@/services/RestaurantService";
import { setRestaurant, useAppDispatch } from "@/store";

type Status = 'success' | 'failed'

function useRestaurant() {
    const dispatch = useAppDispatch()


    const updateRestaurant = async (
        values: FormData
    ): Promise<
        | {
            status: Status
            message: string
        }
        | undefined
    > => {

        try {
            const resp = await apiUpdateRestaurant(values)
            if(resp.status === 200){
                const resp2 = await apiGetRestaurant()
                dispatch(setRestaurant(resp2.data))
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    return {
        updateRestaurant,
    }
}


export default useRestaurant