import { order } from '@/@types/order'
import appConfig from '@/configs/app.config'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { LegacyRef, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

const Invoice = forwardRef(
  ({ item }: { item: order }, ref: LegacyRef<HTMLDivElement>) => {
    const RestaurantInfo = useAppSelector(
      (state) => state.restaurant.restaurant
    )
    const { t, i18n } = useTranslation()
    return (
      <div
        dir={i18n.dir()}
        ref={ref}
        className="max-w-[500px] w-full flex flex-col divide-y px-4"
      >
        <div className="flex flex-col gap-4 items-center py-4 justify-center">
          <img
            src={appConfig.apiPrefix + RestaurantInfo.image}
            alt="logo"
            className="w-20"
          />
          <div className="flex flex-col gap-1 items-center">
            <h2 className="text-sm">
              {JSON.parse(RestaurantInfo.name!).ar} |{' '}
              {JSON.parse(RestaurantInfo.name!).en}
            </h2>
            <h2 className="text-sm">
              {JSON.parse(RestaurantInfo.address!).ar} |{' '}
              {JSON.parse(RestaurantInfo.address!).en}
            </h2>
            <h2 className="text-sm">{RestaurantInfo.phone}</h2>
          </div>
        </div>
        <div className="flex flex-col gap-2 py-4">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">
              {t('orders.customerName')} :
            </h4>
            <p className="text-black font-bold text-sm">
              {item.customerName}
            </p>
          </div>
          {item.customerPhone && (
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">
                {t('orders.customerPhone')} :
              </h4>
              <p className="text-black font-bold text-sm">
                {item.customerPhone}
              </p>
            </div>
          )}
          {item.customerAddress && (
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">
                {t('orders.customerAddress')} :
              </h4>
              <p className="text-black font-bold text-sm">
                {item.customerAddress}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">
              {t('orders.orderNumber')} :
            </h4>
            <p className="text-black font-bold text-sm">
              {item.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">
              {t('orders.orderType')} :
            </h4>
            <p className="text-black font-bold text-sm">
              {item.orderType === 'inRestaurant' &&
                t('orders.inRestaurant')}{' '}
              {item.orderType === 'delivery' &&
                t('orders.delivery')}{' '}
              {item.orderType === 'takeaway' &&
                t('orders.takeaway')}
            </p>
          </div>
          {item.tableNumber ? <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm">
                {t('orders.tableNumber')} :
              </h4>
              <p className="text-black font-bold text-sm">
                {item.tableNumber.toString()}
              </p>
            </div> : null
          }
        </div>
        <div className="flex items-center justify-between py-4 gap-4">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm">
              {t('orders.Order time')} :
            </h4>
            <p className="text-black font-bold text-sm">
              {dayjs(item.createdAt).format('DD/MM/YYYY LT')}
            </p>
          </div>
          {/* <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm">رقم الطلب: </h4>
                    <p className="text-black font-bold text-sm">{item._id}</p>
                </div> */}
        </div>
        <div className="py-4">
          <table className="w-full">
            <thead>
              <tr className="text-black font-semibold text-sm">
                <th className="text-start">
                  {t('orders.product')}
                </th>
                <th className="text-start">
                  {t('orders.Quantity')}
                </th>
                <th className="text-start">
                  {t('orders.price')}
                </th>
                <th className="text-start">
                  {t('orders.Total')}
                </th>
              </tr>
            </thead>
            <tbody>
              {item?.products &&
                item?.products.map((meal, i) => (
                  <tr
                    key={i}
                    className="text-black font-semibold text-sm text-start"
                  >
                    <td>{JSON.parse(meal.name ??'{"en": ""}')?.en}</td>
                    <td>{meal.quantity}</td>
                    <td>
                      {meal.price}{' '}
                      {i18n.language == 'ar'
                        ? RestaurantInfo.currency?.name
                        : RestaurantInfo.currency
                          ?.enName}
                    </td>
                    <td>
                      {meal.price! * meal.quantity!}{' '}
                      {i18n.language == 'ar'
                        ? RestaurantInfo.currency?.name
                        : RestaurantInfo.currency
                          ?.enName}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div>
          {item.shippingFees ? <div className="flex items-center justify-between py-1">
            <p className='text-black'>{t('orders.Delivery price')}</p>
            <p className="text-black font-bold text-xs">
              {item.shippingFees}{' '}
              {i18n.language == 'ar'
                ? RestaurantInfo.currency?.name
                : RestaurantInfo.currency?.enName}
            </p>
          </div> : null}
          <div className="flex items-center justify-between py-2">
            <h4>{t('orders.totalPrice')}</h4>
            <p className="text-black font-bold text-sm">
              {item.totalPrice}{' '}
              {i18n.language == 'ar'
                ? RestaurantInfo.currency?.name
                : RestaurantInfo.currency?.enName}
            </p>
          </div>
        </div>
        {item.notes && <div className='mb-3 '>
          <p className='text-center text-black text-lg py-2'>Notes</p>
          <p className='rounded-md border p-2 text-center '>
              {item.notes}
          </p>
        </div>}
        <div className="flex flex-col gap-4 py-4">
          <p className="text-center text-black font-bold text-sm">
            {t('orders.Thank you')}
          </p>
        </div>
      </div>
    )
  }
)
export default Invoice
