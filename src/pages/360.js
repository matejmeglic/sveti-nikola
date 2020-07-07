import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"



export default function Home({data}) {

   


  return (
    <div>
     <Layout></Layout>
            <div className="peak360">
              <img src="sveti_nikola_hvar_360-1.jpg" alt="Sveti Nikola Hvar pano north" title="Sveti Nikola Hvar - North panorama" />
              <img src="sveti_nikola_hvar_360-6.jpg" alt="Sveti Nikola Hvar pano east" title="Sveti Nikola Hvar - East panorama" />
              <img src="sveti_nikola_hvar_360-3.jpg" alt="Sveti Nikola Hvar pano south" title="Sveti Nikola Hvar - South panorama" />
              <img src="sveti_nikola_hvar_360-5.jpg" alt="Sveti Nikola Hvar pano west" title="Sveti Nikola Hvar - West panorama" />
          </div>
    </div>
    )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: {order: ASC, fields: [frontmatter___title]}, filter: {frontmatter: {lang: {eq: "slo"}}, fields: {slug: {regex: "/^.slo/"} }}) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            lang
            title
            date
            length
            time
            warning
            marked
          }
          excerpt(pruneLength: 500)
          fields {
            slug
          }
        }
      }
    },
    
    allPublicJson {
      edges {
        node {
          hidden_routes {
            color
            parts
            route
          }
          icons {
            coordinates
            name
            translation {
              en
              hr
              slo
            }
          }
          languages {
            item
            translation {
              en
              hr
              slo
            }
          }
          routeParts {
            route
            coordinates
          }
          routes {
            alternative
            color
            hiddenRoute
            page
            parts
            route
          }
        }
      }
    }

  }
  
`