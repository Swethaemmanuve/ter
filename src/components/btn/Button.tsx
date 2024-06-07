import React from 'react'
import './Button.scss'

const Button = ({ onClick, children, linearBackground, backGroundGreen, disabled }: any) => {
    const buttonStyle = linearBackground
        ? {
              backgroundImage: `linear-gradient(to right, ${linearBackground})`,
              fontSize: '1.3rem',
              fontWeight: '500',
          }
        : {}

    const btnBg = backGroundGreen ? { backgroundColor: `${backGroundGreen}` } : {}

    const disabledStyle = {
        cursor: 'not-allowed',
        background: '#bfbdbd',
    }

    return (
        <div
            className='custom-button'
            onClick={disabled ? () => {} : (e) => onClick(e)}
            style={{ ...buttonStyle, ...btnBg, ...(disabled ? disabledStyle : {}) }}
        >
            {children}
        </div>
    )
}

export default Button
