import React, { useEffect, useState } from 'react'
import { StarRating } from './StarRating'
import { useTranslation } from 'react-i18next'
import { apiGetRatesStats } from '@/services/RateService'
import { MenuEvaluation, RateStats } from '@/@types/rating'
import { useAppSelector } from '@/store'

interface EvaluationStatsProps {
    evaluations: MenuEvaluation[]
}

export const EvaluationStats: React.FC<EvaluationStatsProps> = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(true)
    const [statsData, setStatsData] = useState<RateStats>({})
    const avgRate = useAppSelector(
        (state) => state.restaurant.restaurant.avgRate
    )
    const fetchStats = async () => {
        try {
            const response = await apiGetRatesStats()
            setStatsData(response.data.data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    const calculateStats = () => {
        const totalRatings = Object.values(statsData).reduce(
            (acc, curr) => acc + curr,
            0
        )

        return [5, 4, 3, 2, 1].map((stars) => ({
            stars,
            count: statsData[stars] || 0,
            percentage: totalRatings
                ? ((statsData[stars] || 0) / totalRatings) * 100
                : 0,
        }))
    }

    if (loading) {
        return (
            <div className="p-6 rounded-lg shadow-md mb-6 bg-gray-500">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-400 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="h-4 bg-gray-400 rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const stats = calculateStats()

    return (
        <div className="p-6 rounded-lg shadow-md mb-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 ">
                {t('rateing.sub-title')}
            </h2>
            <div className="space-y-3 flex items-center gap-4">
                <span className="text-7xl">{avgRate}</span>
                <div className="flex-1">
                    {stats.map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center gap-4">
                            <StarRating rating={stars} />
                            <div className="flex-1">
                                <div className="h-2.5 w-full rounded-full bg-gray-100">
                                    <div
                                        className="h-2.5 bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                            <div className="w-20 text-sm ">
                                {count} ({percentage.toFixed(1)}%)
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
