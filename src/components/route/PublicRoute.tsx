import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'
import { useAppSelector } from '@/store'

const { authenticatedEntryPath, authenticatedEntryAdminPath } = appConfig

const PublicRoute = () => {
    const { authenticated } = useAuth()
    const userRole = useAppSelector((state) => state.auth.user.role)
    return authenticated ? (
        <Navigate
            to={
                userRole === 1
                    ? authenticatedEntryAdminPath
                    : authenticatedEntryPath
            }
        />
    ) : (
        <Outlet />
    )
}

export default PublicRoute
