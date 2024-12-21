import { IoFastFoodOutline, IoRestaurantOutline, IoStatsChartOutline } from 'react-icons/io5'
import { MdOutlineAdminPanelSettings, MdOutlineCategory, MdOutlineDeliveryDining, MdOutlineShare, MdOutlineStarRate, MdPersonOutline } from 'react-icons/md'
import { GoPackage } from 'react-icons/go'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    admin_home: <IoStatsChartOutline />,
    home: <IoRestaurantOutline />,
    categories: <MdOutlineCategory />,
    products: <IoFastFoodOutline />,
    order: <MdOutlineDeliveryDining />,
    share: <MdOutlineShare />,
    rateing: <MdOutlineStarRate />,
    client: <MdPersonOutline />,
    admin: <MdOutlineAdminPanelSettings />,
    package: <GoPackage />,
}

export default navigationIcon
