import { useAuth0 } from '@auth0/auth0-react'

export default function Comments() {

    const { isAuthenticated, user, loginWithRedirect } = useAuth0();

    return (
        <>
            {isAuthenticated ?
                <div className="comment-section mt-5" style={{ padding: "1rem 2rem", backgroundColor: "#121212", borderRadius: "1rem" }}>
                    <label style={{ fontSize: "3rem", color: "white" }}>Comments</label>
                    <form action="">
                        <textarea className="comment" style={{ color: "white", fontSize: "1.125rem", height: "10em", padding: '0.5rem', resize: "none" }} placeholder="Write your comment here..." rows={10}></textarea>
                        <button className="btn mt-2" style={{ background: "orange", color: "black" }} type="submit">Submit Comment</button>
                    </form>
                    <hr className="mt-3 mb-3" />
                    <div>No Comments</div>
                </div >
                : <div className="comment-section mt-5" style={{ padding: "1rem 2rem", backgroundColor: "#121212", borderRadius: "1rem" }}>
                    <label style={{ fontSize: "3rem", color: "white" }}>Comments</label>
                    <div className="login-required">Please <button className='loginbtn' onClick={() => loginWithRedirect()}>Login</button> to comment.</div>
                </div>}

        </>
    )
}
