import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/UserAuthContext'

type auth = {
    user: any
}

const Authpro = (props: any) => {
    const { user } = useAuthContext() as auth
    return user ? <Outlet /> : <Navigate to={'/login'} />
}

export default Authpro
