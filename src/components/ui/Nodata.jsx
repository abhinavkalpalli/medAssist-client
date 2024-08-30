import React from 'react'
import image from '../../assets/Nodata.jpg'

function Nodata() {
  return (
    <div className="flex justify-center items-center h-full">
      <img
        src={image}
        alt="No data available"
        className="max-w-xl h-auto"
      />
    </div>
  )
}

export default Nodata
