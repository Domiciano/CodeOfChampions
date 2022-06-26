import React from 'react';
import boxIcon from '../../img/svg/box.svg';
import checkedIcon from '../../img/svg/checked.svg';

interface CheckBoxInterface {
  isActive: boolean;
}

const CheckBox: React.FC<CheckBoxInterface> = ({ isActive }) => {
  return (
    <>
      {isActive ? 
        <img src={checkedIcon} alt="checked" /> 
        :
        <img src={boxIcon} alt="no checked" /> 
      }
    </>
  )
}

export default CheckBox