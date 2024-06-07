import React, { useState } from 'react'
import './Input.scss'
import visibleIcon from '../../../src/assets/icons/ic_visible.svg'
import inVisibleIcon from '../../../src/assets/icons/ic_Invisible.svg'

const Input = ({ inputValue, onInputChange, error, label, inputType = 'text', maxLength }: any) => {
    const [showPassword, setShowPassword] = useState(false)

    const handleChange = (event: any) => {
        const { value } = event.target

    if (inputType === 'number') {
        if (/^\d*$/.test(value)) {
            onInputChange(value);
        }
    } if (inputType === 'text') {
        if (/^[a-zA-Z ]*$/.test(value)) {
            onInputChange(value);
        }
    }else {
        onInputChange(value);
    }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className='child-container'>
            <label className='input-label'>{label}</label>
            <div className='input-wrapper'>
                <input
                    type={inputType === 'password' && !showPassword ? 'password' : 'text'}
                    value={inputValue}
                    placeholder={`${label}*`}
                    maxLength={maxLength? maxLength : 'auto'}
                    onChange={handleChange}
                    className={`input-field ${error ? 'error-border' : ''}`}
                />
                {inputType === 'password' && (
                    <img
                        src={showPassword ? visibleIcon : inVisibleIcon}
                        alt='toggle visibility'
                        className='input-icon'
                        onClick={togglePasswordVisibility}
                    />
                )}
            </div>
            {error && <p className='error-message'>{error}</p>}
        </div>
    )
}

export default React.memo(Input); 
