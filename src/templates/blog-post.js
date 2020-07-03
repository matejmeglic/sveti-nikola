import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { rhythm } from "../utils/typography"
import '../styles/Maps.css';

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title


  return (
    <Layout location={location} title={siteTitle} lang={post.frontmatter.lang} title={post.frontmatter.title}>
      <div className={"post"}>
        <header>
          <h1 style={{marginTop: rhythm(1), marginBottom: 0,}}>
          <div id="pics"></div>
            {post.frontmatter.title}
          </h1>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr style={{marginBottom: rhythm(2)}} />
        
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        lang
        title
        date
        length
        time
        warning
        marked
      }
    }
  }
`