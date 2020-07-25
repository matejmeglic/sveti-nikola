import React from "react"
import { Link } from "gatsby"
import {useStaticQuery, graphql} from "gatsby"

export default function Layout() {
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
        <Link to={`/en/`} id="EN" className="link" className="last">EN</Link> 
        <Link to={`/slo/`} id="SLO" className ="link">SLO</Link>
        <Link to={`/`} id="HR" className ="link">HR</Link>
        <Link to={`/360/`} id="360" className ="link">360</Link>
      </div>
       
    </div>
  )
}

