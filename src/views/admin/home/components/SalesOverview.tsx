import { StatisticsType } from '@/@types/statistics'
import { Card, Skeleton, Table } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { BsBagCheck, BsBicycle, BsShop } from 'react-icons/bs'
const { Tr, Th, Td, THead, TBody } = Table

interface Props {
    isLoading: boolean
    statistics: StatisticsType | null
}

const SalesOverview = ({ isLoading, statistics }: Props) => {
    const { t } = useTranslation()
    const ordersByType = statistics?.orders_by_type || {
        delivery: 0,
        inRestaurant: 0,
        takeaway: 0,
    }

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        {t('statistics.orders_overview')}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {t('statistics.view_your_orders_summary')}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <Skeleton className="w-full h-[400px]" />
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`p-2 rounded-lg w-fit bg-orange-100`}
                                    >
                                        <BsBicycle className="text-2xl font-bold text-orange-500" />
                                    </div>
                                    <p className=" text-xl font-semibold">
                                        {t('statistics.delivery_orders')}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">
                                        {ordersByType.delivery}
                                    </span>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`p-2 rounded-lg w-fit bg-green-100`}
                                    >
                                        <BsShop className="text-2xl font-bold text-green-500" />
                                    </div>
                                    <p className=" text-xl font-semibold">
                                        {t('statistics.in_restaurant_orders')}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">
                                        {ordersByType.inRestaurant}
                                    </span>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`p-2 rounded-lg w-fit bg-yellow-100`}
                                    >
                                        <BsBagCheck className="text-2xl font-bold text-yellow-500" />
                                    </div>
                                    <p className=" text-xl font-semibold">
                                        {t('statistics.takeaway_orders')}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">
                                        {ordersByType.takeaway}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {statistics?.top_restaurants &&
                        statistics.top_restaurants.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold mb-4">
                                    {t('statistics.top_performing_restaurants')}
                                </h4>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <THead>
                                            <Tr>
                                                <Th>{t('statistics.rank')}</Th>
                                                <Th>
                                                    {t('statistics.restaurant')}
                                                </Th>
                                                <Th>
                                                    {t('statistics.delivery')}
                                                </Th>
                                                <Th>
                                                    {t(
                                                        'statistics.in_restaurant'
                                                    )}
                                                </Th>
                                                <Th>
                                                    {t('statistics.takeaway')}
                                                </Th>
                                                <Th>
                                                    {t(
                                                        'statistics.total_orders'
                                                    )}
                                                </Th>
                                            </Tr>
                                        </THead>
                                        <TBody className="">
                                            {statistics.top_restaurants.map(
                                                (restaurant, index) => (
                                                    <Tr key={index}>
                                                        <Td>{index + 1}</Td>
                                                        <Td>
                                                            {
                                                                restaurant.restaurant_name
                                                            }
                                                        </Td>
                                                        <Td>
                                                            {restaurant
                                                                .orders_by_type
                                                                ?.delivery || 0}
                                                        </Td>
                                                        <Td>
                                                            {restaurant
                                                                .orders_by_type
                                                                ?.inRestaurant ||
                                                                0}
                                                        </Td>
                                                        <Td>
                                                            {restaurant
                                                                .orders_by_type
                                                                ?.takeaway || 0}
                                                        </Td>
                                                        <Td>
                                                            {
                                                                restaurant.total_orders
                                                            }
                                                        </Td>
                                                    </Tr>
                                                )
                                            )}
                                        </TBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                </div>
            )}
        </Card>
    )
}

export default SalesOverview
