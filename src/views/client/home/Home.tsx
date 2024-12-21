import Title from "@/components/shared/Title"
import { Tabs } from "@/components/ui"
import TabList from "@/components/ui/Tabs/TabList"
import TabNav from "@/components/ui/Tabs/TabNav"
import { useTranslation } from "react-i18next"
import { HiOutlineClock, HiOutlineShare } from "react-icons/hi"
import {
    IoLanguageOutline,
    IoRestaurantOutline,
    IoInformationCircleOutline,
} from 'react-icons/io5'
import TabContent from "@/components/ui/Tabs/TabContent"
import BasicInformation from "./components/BasicInformation"
import SocialMedia from "./components/SocialMedia"
import { MdOutlineColorLens, MdOutlineDeliveryDining } from "react-icons/md"
import WorkingHours from "./components/WorkingHours"
import CurrencyAndIanguage from "./components/CurrencyAndIanguage"
import AboutUs from "./components/AboutUs"
import OrderSetting from "./components/orderSetting"
import { useAppSelector } from "@/store"
import useAuthority from "@/utils/hooks/useAuthority"

const Home = () => {
  
  const { t } = useTranslation()
  const userAuthority = useAppSelector((state) => state.auth.user.authority)
  const haveOrder = useAuthority(userAuthority, ['orders.list'])
  
    return (
        <>
            <Title
                Icon={IoRestaurantOutline}
                title={`${t('nav.client-home')}`}
            />
            <Tabs defaultValue="tab1">
                <TabList className="whitespace-nowrap">
                    <TabNav value="tab1" icon={<MdOutlineColorLens />}>
                        {t('client-home.Identity customization')}
                    </TabNav>
                    <TabNav value="tab2" icon={<HiOutlineShare />}>
                        {t('client-home.Social media links')}
                    </TabNav>
                    <TabNav value="tab3" icon={<HiOutlineClock />}>
                        {t('client-home.Working hours')}
                    </TabNav>
                    <TabNav value="tab4" icon={<IoLanguageOutline />}>
                        {t('client-home.Currency and language')}
                    </TabNav>
                    {haveOrder && <TabNav value="tab6" icon={<MdOutlineDeliveryDining />}>
                        {t('client-home.order settings')}
                    </TabNav>}
                    <TabNav value="tab5" icon={<IoInformationCircleOutline />}>
                        {t('client-home.About us')}
                    </TabNav>
                </TabList>
                <div className="p-5">
                    <TabContent value="tab1">
                        <BasicInformation />
                    </TabContent>
                    <TabContent value="tab2">
                        <SocialMedia />
                    </TabContent>
                    <TabContent value="tab3">
                        <WorkingHours />
                    </TabContent>
                    <TabContent value="tab4">
                        <CurrencyAndIanguage />
                    </TabContent>
                    <TabContent value="tab5">
                        <AboutUs />
                    </TabContent>
                    {haveOrder && <TabContent value="tab6">
                        <OrderSetting />
                    </TabContent>}
                </div>
            </Tabs>
        </>
    )
}

export default Home
