import React from 'react'
import './Buttonimg.scss'
import googleIcon from '../../assets/icons/ic-Google.svg'
import appleIcon from '../../assets/icons/ic_Apple.svg'

function ButtonImg({ google, text, style }: any) {

    const Icon = google
    
    return (
        <div className='button-with-icon' style={style} onClick={() => {}}>
            <img className='button-icon' src={Icon ? googleIcon : appleIcon} alt='Icon' />
            <span className='button-lable'>{text}</span>
        </div>
    )
}

export default ButtonImg
