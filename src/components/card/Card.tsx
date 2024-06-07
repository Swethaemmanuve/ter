import React, { useEffect, useState } from 'react'
import './Card.scss'
import checkedIcon from '../../assets/icons/ic_checked.svg'
import website6 from '../../assets/images/website6.png'
import website5 from '../../assets/images/website5.png'

interface card {
    url?: string
    title?: number
    pages?: boolean
    isSelectable?: boolean
    handleCallBack?: any
    onClick?: any
    data?: any
    value?: string
    onNavigating?: any
}

function Card({
    url,
    title,
    pages,
    isSelectable,
    handleCallBack,
    onClick,
    data,
    value,
    onNavigating,
}: card) {
    const [isSelected, setIsSelected] = useState(false)

    useEffect(() => {
        if (data?.template_ref === value) {
            setIsSelected(true)
        } else {
            setIsSelected(false)
        }
    }, [value])

    const onSelectedCard = (item: any) => {
        if (onNavigating) {
            console.log('data', data)
            onNavigating(data.project_ref)
        } else if (isSelectable) {
            setIsSelected(!isSelected)
            handleCallBack(isSelected)
            onClick(item)
        }
    }

    const calculateTimeAgo = (data: any) => {
        const now: any = new Date()
        const past: any = new Date(data?.updatedAt)
        const diffInMilliseconds: any = now - past
        const diffInMinutes = Math.floor(diffInMilliseconds / 60000)

        if (diffInMinutes < 60) {
            return `Edited ${diffInMinutes} minutes ago`
        } else if (diffInMinutes < 1440) {
            const diffInHours = Math.floor(diffInMinutes / 60)
            const remainingMinutes = diffInMinutes % 60
            return `Edited ${diffInHours} hours and ${remainingMinutes} minutes ago`
        } else {
            const diffInDays = Math.floor(diffInMinutes / 1440)
            const remainingMinutes = diffInMinutes % 1440
            const diffInHours = Math.floor(remainingMinutes / 60)
            const remainingMinutesAfterHours = remainingMinutes % 60
            return `Edited  ${diffInHours} hours and ${remainingMinutesAfterHours} minutes ago`
        }
    }

    return (
        <div
            className={`card ${isSelected ? '' : 'selectableCard'}`}
            style={{ cursor: isSelectable || onNavigating ? 'pointer' : 'default' }}
            onClick={(item) => onSelectedCard(item)}
        >
            <div className='img-container'>
                <img src={url} alt='' style={{ width: '100%', objectFit: 'cover' }} />
            </div>
            {pages && (
                <div className='card-info'>
                    <div className='card-info-top'>
                        <p className='card-title'>{data?.project_ref}</p>
                        <p>97%</p>
                    </div>
                    <p className='card-info-time'>{calculateTimeAgo(data)}</p>
                </div>
            )}
            {!pages && <p className='card-title'>{data?.template_ref}</p>}

            {isSelectable && (
                <div
                    className={isSelected ? 'check-icon' : 'check-icon-none'}
                    style={{
                        background: isSelected ? '#7cb845' : '#fff',
                        borderColor: isSelected ? '#7cb845' : 'rgb(180, 179, 179)',
                    }}
                >
                    <img src={checkedIcon} alt='checked-icon' />
                </div>
            )}
        </div>
    )
}

export default React.memo(Card)
