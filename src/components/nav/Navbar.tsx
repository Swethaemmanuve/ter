import React, { useState } from 'react'
import './Navbar.scss'
import Button from '../btn/Button'
import SearchInput from '../searchInput/SearchInput'
import Templates from '../../pages/forms/Templates'
import Pages from '../../pages/forms/Pages'

function Navbar({ lable, setTrigger, isDisabled }: any) {
    const [searchInputValue, setsearchInputValue] = useState('')
    const [showModalUpload, setShowModalUpload] = useState(false)
    const [showModalCreate, setShowModalCreate] = useState(false)
    const handleClick = () => {
        if (lable === 'Create') {
            setShowModalCreate(true)
        } else {
            setShowModalUpload(true)
        }
    }

    const handleSeachInputChange = (newValue: any) => {
        setsearchInputValue(newValue)
    }

    return (
        <div className='nav-container'>
            <div className='nav-content'>
                <div className='upload-btn-container'>
                    <Button disabled={isDisabled} onClick={handleClick}>
                        {lable}
                    </Button>
                </div>
                <div className='search-input-containe'>
                    <SearchInput value={searchInputValue} onChange={handleSeachInputChange} />
                </div>
                <Templates
                    setTrigger={setTrigger}
                    isOpenUpload={showModalUpload}
                    setShowModalUpload={setShowModalUpload}
                />
                <Pages
                    setTrigger={setTrigger}
                    isOpenCreate={showModalCreate}
                    setShowModalCreate={setShowModalCreate}
                />
            </div>
        </div>
    )
}

export default React.memo(Navbar)
