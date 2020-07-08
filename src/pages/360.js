import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import pic360_1 from "../contents/images/360/360_small/sveti_nikola_hvar_360-1.jpg"
import pic360_2 from "../contents/images/360/360_small/sveti_nikola_hvar_360-6.jpg"
import pic360_3 from "../contents/images/360/360_small/sveti_nikola_hvar_360-3.jpg"
import pic360_4 from "../contents/images/360/360_small/sveti_nikola_hvar_360-5.jpg"
import SEO from "../components/seo"

export default function Home({data}) {

   


  return (
    <div>
      <SEO title="Hvar 360 panorama" description="360 degrees on Sveti Nikola"/>
     <Layout></Layout>
            <div className="peak360">
              <img src={pic360_1} alt="Sveti Nikola Hvar pano north" title="Sveti Nikola Hvar - North panorama" />
              <img src={pic360_2} alt="Sveti Nikola Hvar pano east" title="Sveti Nikola Hvar - East panorama" />
              <img src={pic360_3} alt="Sveti Nikola Hvar pano south" title="Sveti Nikola Hvar - South panorama" />
              <img src={pic360_4} alt="Sveti Nikola Hvar pano west" title="Sveti Nikola Hvar - West panorama" />
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