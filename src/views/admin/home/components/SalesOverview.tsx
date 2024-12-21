import { StatisticsType } from '@/@types/statistics'
import { Card, Skeleton } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { BsBagCheck, BsBicycle, BsShop } from 'react-icons/bs'

interface Props {
  isLoading: boolean
  statistics: StatisticsType | null
}

const SalesOverview = ({ isLoading, statistics }: Props) => {
  const { t } = useTranslation()
  const ordersByType = statistics?.orders_by_type || {
    delivery: 0,
    inRestaurant: 0,
    takeaway: 0
  }

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">{t('statistics.orders_overview')}</h3>
          <p className="text-sm text-gray-500">{t('statistics.view_your_orders_summary')}</p>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="w-full h-[400px]" />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className='space-y-2'>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg w-fit bg-orange-100`}>
                    <BsBicycle className="text-2xl font-bold text-orange-500" />
                  </div>
                  <p className="text-gray-600 text-xl font-semibold">{t('statistics.delivery_orders')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{ordersByType.delivery}</span>
                </div>
              </div>
            </Card>
            <Card>
              <div className='space-y-2'>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg w-fit bg-green-100`}>
                    <BsShop className="text-2xl font-bold text-green-500" />
                  </div>
                  <p className="text-gray-600 text-xl font-semibold">{t('statistics.in_restaurant_orders')}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{ordersByType.inRestaurant}</span>
                </div>
              </div>
            </Card>
            <Card >
              <div className='space-y-2'>
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg w-fit bg-yellow-100`}>
                  <BsBagCheck className="text-2xl font-bold text-yellow-500" />
                </div>
                <p className="text-gray-600 text-xl font-semibold">{t('statistics.takeaway_orders')}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{ordersByType.takeaway}</span>
              </div>
              </div>
            </Card>
          </div>

          {statistics?.top_restaurants && statistics.top_restaurants.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">{t('statistics.top_performing_restaurants')}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">{t('statistics.rank')}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">{t('statistics.restaurant')}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">{t('statistics.delivery')}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">{t('statistics.in_restaurant')}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">{t('statistics.takeaway')}</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">{t('statistics.total_orders')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {statistics.top_restaurants.map((restaurant, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm text-center">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-center text-gray-900">{restaurant.restaurant_name}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-center text-gray-900">{restaurant.orders_by_type?.delivery || 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-center text-gray-900">{restaurant.orders_by_type?.inRestaurant || 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-center text-gray-900">{restaurant.orders_by_type?.takeaway || 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-medium text-center text-gray-900">{restaurant.total_orders}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export default SalesOverview