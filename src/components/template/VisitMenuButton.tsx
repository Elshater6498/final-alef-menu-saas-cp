import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store'
import { BsEye } from 'react-icons/bs'
import appConfig from '@/configs/app.config'

const VisitMenuButton = () => {
    const { i18n } = useTranslation()
    const restaurantUrl = useAppSelector(
        (state) => state.restaurant.restaurant.url
    )
    return (
        <a
            href={`${appConfig.mainurl}${restaurantUrl}`}
            target="_blank"
            rel="noreferrer"
            className='flex gap-2 items-center justify-center border border-gray-100 rounded-full py-2 px-5'
        >
          <BsEye  />
          <span>{i18n.language === 'ar' ? 'زيارة القائمة' : 'Visit Menu'}</span>
        </a>
    )
}

export default VisitMenuButton
