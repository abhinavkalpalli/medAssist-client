import React from 'react'


import "./Error.css"
import { useNavigate } from 'react-router-dom';



function Error() {

  const navigate = useNavigate()


  return (
    <>
      <div className="errorpage h-screen w-screen flex items-center justify-center">
        <div className="fourNotFour -mt-32 flex items-end">
          <div className="border-y-1 flex items-center">
            <button className='goHomeButton'
              onClick={() => {
                navigate("/");
              }}
            >
              <p>Go Home</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Error