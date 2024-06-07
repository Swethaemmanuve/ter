import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login/Login'
import PageNotFound from './pages/PageNotFound/PageNotFound'
import Home from './pages/Home/Home'
import AuthProvider from './context/UserAuthContext'
import Pages from './pages/Pages/Pages'
import Authpro from './routes/Auth'
import Templates from './pages/Templates/Templates'
import Edit from './pages/edit/Edit'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/login' element={<Login />} />
                    <Route path='/404' element={<PageNotFound />} />
                    <Route path='*' element={<PageNotFound />} />

                    <Route path='/' element={<Authpro />}>
                        <Route path='/' element={<Home />}>
                            <Route index element={<Navigate replace to={'/templates'} />} />
                            <Route path='templates' element={<Templates />}></Route>
                            <Route path='pages' element={<Pages />}></Route>
                        </Route>
                        <Route path='/editor' element={<Edit />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
