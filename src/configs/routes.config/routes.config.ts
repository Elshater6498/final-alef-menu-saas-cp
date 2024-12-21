import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
    {
        key: 'access-denied',
        path: '/access-denied',
        component: lazy(() => import('@/views/accessDenied')),
        authority: [],
        meta: {},
    },
    {
        key: 'admin.home',
        path: '/admin/home',
        component: lazy(() => import('@/views/admin/home')),
        authority: ['1', '2'],
    },
    {
        key: 'admin.clients',
        path: '/admin/clients',
        component: lazy(() => import('@/views/admin/clients')),
        authority: ['1', '2'],
    },
    // {
    //     key: 'admin.packages',
    //     path: '/admin/packages',
    //     component: lazy(() => import('@/views/admin/packages')),
    //     authority: ['1', '2'],
    // },
    {
        key: 'admin.users',
        path: '/admin/users',
        component: lazy(() => import('@/views/admin/users')),
        authority: ['1', '2'],
    },
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/client/home')),
        authority: ['3' , '4'],
    },
    {
        key: 'categories',
        path: '/categories',
        component: lazy(() => import('@/views/client/categories')),
        authority: ['3' , '4'],
        meta: {},
    },
    {
        key: 'products',
        path: '/products',
        component: lazy(() => import('@/views/client/products')),
        authority: ['3' , '4'],
        meta: {},
    },
    {
        key: 'orders',
        path: '/orders',
        component: lazy(() => import('@/views/client/orders')),
        authority: ['3' , '4'],
        meta: {},
    },
    {
        key: 'rateing',
        path: '/rateing',
        component: lazy(() => import('@/views/client/ratings')),
        authority: ['3' , '4'],
        meta: {},
    },
    {
        key: 'share',
        path: '/share',
        component: lazy(() => import('@/views/client/share')),
        authority: ['3' , '4'],
        meta: {},
    },
    {
        key: 'client-admins',
        path: '/client-admins',
        component: lazy(() => import('@/views/client/users')),
        authority: ['3'],
        meta: {},
    },
]