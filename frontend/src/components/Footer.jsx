import React from 'react'
import current_year from '../utils/footerDate'

const Footer = () => {
  return (
    <div className='mb-2 flex justify-center'>
        <p className='font-montserrat-regular text-md text-[#969696] font-light'> © triloop {current_year}</p>
    </div>
  )
}

export default Footer