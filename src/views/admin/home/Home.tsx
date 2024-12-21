import { StatisticsType } from '@/@types/statistics'
import Title from '@/components/shared/Title'
import { apiGetStatistics } from '@/services/StatisticsService'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoStatsChartOutline } from 'react-icons/io5'
import StatCards from './components/StatCards'
import SalesOverview from './components/SalesOverview'


const Home = () => {
  const { t ,i18n} = useTranslation()
  const [statistics, setStatistics] = useState<StatisticsType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchStatistics = async () => {
    setIsLoading(true)
    try {
      const response = await apiGetStatistics(i18n.language)
      if (response.status === 200) {
        setStatistics(response.data)
      }
    } catch (error) {
      console.error(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStatistics()
  }, [i18n.language])

  return (
    <div className="space-y-4">
      <Title Icon={IoStatsChartOutline} title={`${t('nav.home')}`} />
      <StatCards isLoading={isLoading} statistics={statistics} />
      <SalesOverview isLoading={isLoading} statistics={statistics} />
    </div>
  )
}

export default Home
