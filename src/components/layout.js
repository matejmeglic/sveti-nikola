import React from "react"
import { Link } from "gatsby"
import {useStaticQuery, graphql} from "gatsby"
import Maps from "./Maps"

export default function Layout({ children }) {
    const data = useStaticQuery(
        graphql`
          query {
            site {
              siteMetadata {
                title
              }
            }
          }
        `
      )
  

    return (
    
    <div>
      <div className="navigation">
        <Link to={`/`}><h1>{data.site.siteMetadata.title}</h1></Link>
        <Link to={`/en/`} className="link" className="last">EN</Link>
        <Link to={`/`} className ="link">SLO</Link>
        <Link to={`/hr/`} className ="link">HR</Link>
      </div>
      <Maps></Maps>     
      <div className="wrapper"> 
      {children}
      </div>

      
    </div>
  )
}

