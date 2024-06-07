import React, {useState} from 'react'
import './SearchInput.scss'
import serachIcon from '../../assets/icons/ic_search-normal.svg'
function SearchInput({ value, onChange }:any) {

   const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event:any) => {
        const newValue = event.target.value; 
        onChange(newValue); 
    };

  return (
    <div className="search-container">
      <img className="search-icon" src={serachIcon} alt="Search Icon" />
        <input
        className="search-input"
        type="text"
        value={value}
        placeholder="Search for anything"
        onChange={handleInputChange}
        />
  </div>
  )
}

export default SearchInput
