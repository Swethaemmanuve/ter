import { Outlet, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import SideBar from '../../components/Sidebar/SideBar'
// import Pages from '../form/Pages'

type dataContextType = {
    closeSidebar: () => void
}

function Home() {
    const location = useLocation()
    const [backgroundColor, setBackgroundColor]: any = useState('#F8FAFF')

    return (
        <div className='wrapper' style={{ width: '100vw', height: '100vh', display: 'flex' }}>
            <SideBar />
            <main style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    )
}

export default Home