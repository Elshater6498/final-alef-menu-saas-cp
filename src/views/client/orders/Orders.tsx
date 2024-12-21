import Title from "@/components/shared/Title"
import { useTranslation } from "react-i18next"
import { MdOutlineDeliveryDining } from "react-icons/md"
import { Tabs } from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { HiOutlineArchive } from "react-icons/hi"
import NewOrder from "./components/NewOrder"
import OrderArchive from "./components/OrderArchive"

const Orders = () => {
    const { t } = useTranslation()
    return (
        <>
            <Title Icon={MdOutlineDeliveryDining} title={`${t('nav.orders')}`} />
            <Tabs defaultValue="newOrder">
                <TabList>
                    <TabNav value="newOrder" icon={<MdOutlineDeliveryDining />}>
                        {t('orders.New orders')}
                    </TabNav>
                    <TabNav value="oldOrder" icon={<HiOutlineArchive />}>
                        {t('orders.Order archive')}
                    </TabNav>
                </TabList>
                <div className="p-4">
                    <TabContent value="newOrder">
                        <NewOrder />
                    </TabContent>
                    <TabContent value="oldOrder">
                        <OrderArchive />
                    </TabContent>
                </div>
            </Tabs>
        </>
    )
}

export default Orders