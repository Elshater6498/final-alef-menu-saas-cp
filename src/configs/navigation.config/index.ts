import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'admin.home',
        path: '/admin/home',
        title: 'Home',
        translateKey: 'nav.home',
        icon: 'admin_home',
        type: NAV_ITEM_TYPE_ITEM,
        authority:  ['1', '2'],
        subMenu: [],
    },
    // {
    //     key: 'admin.packages',
    //     path: '/admin/packages',
    //     title: 'package-management',
    //     translateKey: 'nav.package-management',
    //     icon: 'package',
    //     type: NAV_ITEM_TYPE_ITEM,
    //     authority:  ['1', '2'],
    //     subMenu: [],
    // },
    {
        key: 'admin.clients',
        path: '/admin/clients',
        title: 'client-management',
        translateKey: 'nav.client-management',
        icon: 'client',
        type: NAV_ITEM_TYPE_ITEM,
        authority:  ['1', '2'],
        subMenu: [],
    },
    {
        key: 'admin.users',
        path: '/admin/users',
        title: 'admin-management',
        translateKey: 'nav.admin-management',
        icon: 'admin',
        type: NAV_ITEM_TYPE_ITEM,
        authority:  ['1'],
        subMenu: [],
    },
    {
        key: 'home',
        path: '/home',
        title: 'Home',
        translateKey: 'nav.client-home',
        icon: 'home',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['3' , '4'],
        subMenu: [],
    },
    {
        key: 'categories',
        path: '/categories',
        title: 'categories',
        translateKey: 'nav.categories',
        icon: 'categories',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['categories.list'],
        subMenu: [],
    },
    {
        key: 'products',
        path: '/products',
        title: 'products',
        translateKey: 'nav.products',
        icon: 'products',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['products.list'],
        subMenu: [],
    },
    {
        key: 'orders',
        path: '/orders',
        title: 'orders',
        translateKey: 'nav.orders',
        icon: 'order',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['orders.list'],
        subMenu: [],
    },
    {
        key: 'rateing',
        path: '/rateing',
        title: 'rateing',
        translateKey: 'nav.rateing',
        icon: 'rateing',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['rates.list'],
        subMenu: [],
    },
    {
        key: 'client-admins',
        path: '/client-admins',
        title: 'client-admins',
        translateKey: 'nav.admin-management',
        icon: 'admin',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['3'],
        subMenu: [],
    },
    {
        key: 'share',
        path: '/share',
        title: 'share',
        translateKey: 'nav.share',
        icon: 'share',
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['3' , '4'],
        subMenu: [],
    },
]

export default navigationConfig