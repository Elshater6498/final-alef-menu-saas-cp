export type AppConfig = {
    apiPrefix: string
    mainurl: string
    authenticatedEntryAdminPath: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
}

const appConfig: AppConfig = {
    apiPrefix: 'https://api.alefmenu.com',
    mainurl: 'https://alef-menu-saas.vercel.app/',
    authenticatedEntryAdminPath: '/admin/home',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
}

export default appConfig
