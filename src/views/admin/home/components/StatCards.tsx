// src/views/admin/home/components/StatCards.tsx
import { StatisticsType } from '@/@types/statistics'
import { Card, Skeleton } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { FiUsers } from 'react-icons/fi'
import { IoFastFoodOutline } from 'react-icons/io5'
import {
    MdOutlineAdminPanelSettings,
    MdOutlineCategory,
    MdOutlineDeliveryDining,
    MdPersonOutline,
} from 'react-icons/md'

interface Props {
    isLoading: boolean
    statistics: StatisticsType | null
}

const StatCards = ({ isLoading, statistics }: Props) => {
    const { t } = useTranslation()

    const totalOrders =
        (statistics?.orders_by_type?.delivery || 0) +
        (statistics?.orders_by_type?.inRestaurant || 0) +
        (statistics?.orders_by_type?.takeaway || 0)

    const stats = [
        {
            title: t('statistics.admins_count'),
            value: statistics?.admins_count || 0,
            icon: MdOutlineAdminPanelSettings,
            color: 'bg-blue-100',
            iconColor: 'text-blue-500',
        },
        {
            title: t('statistics.restaurant_owners'),
            value: statistics?.restaurant_owners || 0,
            icon: MdPersonOutline,
            color: 'bg-cyan-100',
            iconColor: 'text-cyan-500',
        },
        {
            title: t('statistics.restaurant_staff'),
            value: statistics?.restaurant_staff || 0,
            icon: FiUsers,
            color: 'bg-red-100',
            iconColor: 'text-red-500',
        },
        {
            title: t('statistics.total_categories'),
            value: statistics?.total_categories || 0,
            icon: MdOutlineCategory,
            color: 'bg-yellow-100',
            iconColor: 'text-yellow-500',
        },
        {
            title: t('statistics.total_products'),
            value: statistics?.total_products || 0,
            icon: IoFastFoodOutline,
            color: 'bg-green-100',
            iconColor: 'text-green-500',
        },
        {
            title: t('statistics.total_orders'),
            value: totalOrders || 0,
            icon: MdOutlineDeliveryDining,
            color: 'bg-orange-100',
            iconColor: 'text-orange-500',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    {isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-8 w-[60px]" />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className={`p-2 rounded-lg w-fit ${stat.color}`}
                                >
                                    <stat.icon
                                        className={`w-6 h-6 ${stat.iconColor}`}
                                    />
                                </div>
                                <p className="text-xl font-semibold">
                                    {stat.title}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-semibold">
                                    {stat.value}
                                </span>
                            </div>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    )
}

export default StatCards
