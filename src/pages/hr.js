import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"

export default function Home({data}) {

  
  return (
      <Layout>
          <div>
            {data.allMarkdownRemark.edges.map(({ node }) => ( 
              <div key={node.id}>
                <Link to={node.fields.slug} css={css`text-decoration: none; color: inherit;`} lang={node.frontmatter.lang} title={node.frontmatter.title}>
                  <h3 css={css`margin-bottom: ${rhythm(1 / 4)};`}>{node.frontmatter.title}{" "}</h3>
                  <p css={css`text-align: justify;`}>{node.excerpt}</p>
                </Link>
              </div>
            ))}
          </div>
        </Layout>

    )
}

export const query = graphql`
query {
  allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}, filter: {frontmatter: {lang: {eq: "hr"}}}) {
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
  }
}

`