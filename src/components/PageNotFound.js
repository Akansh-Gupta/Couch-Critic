import React from 'react'

export default function PageNotFound() {
    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h1>404 - Page Not Found</h1>
            <p className='mt-4'>Sorry, the page you are looking for does not exist.</p>
            <button className='btn bg-danger' onClick={() => window.history.back()}>Go Back</button>
        </div>
    )
}
