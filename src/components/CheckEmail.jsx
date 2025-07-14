import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function CheckEmail() {
    const navigate = useNavigate()
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h4>Please check your inbox, verify your mail and refresh the page</h4>
            <h3>Thank you!</h3>
            <button className='btn bg-danger mt-4' onClick={() => navigate("/movie") }>Go To Home</button>
        </div>
    )
}
