export type AppConfig = {
    apiPrefix: string
    mainurl: string
    socketPrefix: string
    authenticatedEntryAdminPath: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
}

const appConfig: AppConfig = {
    apiPrefix: 'https://api.alefmenu.com',
    socketPrefix: 'wss://api.alefmenu.com',
    mainurl: 'https://alefmenu.com/',
    authenticatedEntryAdminPath: '/admin/home',
    authenticatedEntryPath: '/home',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
}

export default appConfig
