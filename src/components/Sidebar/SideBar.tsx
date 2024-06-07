import React, { useState } from 'react'
import './Sidebar.scss'
import person from '../../assets/images/person.png'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Button, Modal, message } from 'antd'

function SideBar() {
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const navigate = useNavigate()

    const showLogoutConfirm = () => {
        setIsModalOpen(true)
    }
    const handleOk = () => {
        localStorage.clear()
        message.success('Logout successful')
        navigate('/login')
        localStorage.removeItem('userName')
    }
    const handleCancel = () => {
        setIsModalOpen(false)
    }

    return (
        <aside className='sidebar'>
            <div className='logo'>
                <h1 className='heading'>LOGO</h1>
            </div>
            <nav className='menu'>
                <ul>
                    <li className={location.pathname === '/templates' ? 'active' : ''}>
                        <Link to={'templates'}>Templates</Link>
                    </li>
                    <li className={location.pathname === '/pages' ? 'active' : ''}>
                        <Link to={'pages'}>Pages</Link>
                    </li>
                    <li>
                        <Link to={'#'} onClick={() => setOpen(true)}>
                            Settings
                        </Link>
                    </li>
                </ul>
            </nav>
            <div className='user'>
                <img src={person} alt='User' />
                <div className='user-info'>
                    <p className='name'>{localStorage.getItem('userName')}</p>
                    <p className='role'>Product Designer</p>
                </div>
                <button className='logout' onClick={showLogoutConfirm}>
                    Logout
                </button>
            </div>
            <Modal
                title=''
                open={isModalOpen}
                footer={[
                    <div
                        className='btn-container'
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '15px 15px;',
                        }}
                    >
                        <Button
                            key='submit'
                            type='primary'
                            className='btn-cancel'
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: '#fff',
                                borderRadius: '20px',
                                fontWeight: '600',
                                width: '8rem',
                                border: '1px solid #d9d9d9',
                                color: '#242424',
                                fontSize: '2rem',
                                boxShadow: 'none',
                            }}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            key='submit'
                            type='primary'
                            className='btn-submit'
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: '#7CB845',
                                borderRadius: '20px',
                                fontWeight: '600',
                                width: '8rem',
                                boxShadow: 'none',
                            }}
                            onClick={handleOk}
                        >
                            Ok
                        </Button>
                    </div>,
                ]}
                width={'25%'}
                onCancel={handleCancel}
            >
                <p
                    style={{
                        fontSize: '1.4rem',
                        fontWeight: '500',
                        marginTop: '3rem',
                        textAlign: 'center',
                        marginBottom: '2rem',
                    }}
                >
                    Are you sure you want to log out?
                </p>
            </Modal>
        </aside>
    )
}

export default SideBar