import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <div>
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center ms-5">
          <a href="https://simkl.com" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
          <img src="https://eu.simkl.in/img_blog_2012/logo.png" alt="SIMKL" />
          </a>
          <span style={{color:"white"}}>This App is made using SIMKL API.</span>
        </div>
      </footer>
    </div>
  )
}
