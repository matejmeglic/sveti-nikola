const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `contents` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark(sort: {fields: frontmatter___date, order: ASC}, filter: {fields: {slug: {regex: "/^.slo/"}}}) {
        edges {
          node {
            frontmatter {
              lang
              title
              date
              length
              time
              warning
              marked
            }
            fields {
              slug
            }
          }
        }
      }
    }
    
    
  `)
  

var posts = result.data.allMarkdownRemark.edges
posts.forEach((post) => {
  


  createPage({
    path: post.node.fields.slug,
    component: path.resolve(`./src/templates/blog-post.js`),
    context: {
      slug: post.node.fields.slug,
      title: post.node.frontmatter.title,
      lang: post.node.frontmatter.lang
    },
  }
  )
})





const resultEn = await graphql(`
    query {
      allMarkdownRemark(sort: {fields: frontmatter___date, order: ASC}, filter: {fields: {slug: {regex: "/^.en/"}}}) {
        edges {
          node {
            frontmatter {
              lang
              title
              date
              length
              time
              warning
              marked
            }
            fields {
              slug
            }
          }
        }
      }
    }
    
    
  `)
  

postsEn = resultEn.data.allMarkdownRemark.edges
postsEn.forEach((post) => {
  
  createPage({
    path: post.node.fields.slug,
    component: path.resolve(`./src/templates/blog-post.js`),
    context: {
      slug: post.node.fields.slug,
      title: post.node.frontmatter.title,
      lang: post.node.frontmatter.lang
    },
  })
})


const resultHr = await graphql(`
    query {
      allMarkdownRemark(sort: {fields: frontmatter___date, order: ASC}, filter: {fields: {slug: {regex: "/^.hr/"}}}) {
        edges {
          node {
            frontmatter {
              lang
              title
              date
              length
              time
              warning
              marked
            }
            fields {
              slug
            }
          }
        }
      }
    }
    
    
  `)
  

postsHr = resultHr.data.allMarkdownRemark.edges
postsHr.forEach((post) => {
  
  createPage({
    path: post.node.fields.slug,
    component: path.resolve(`./src/templates/blog-post.js`),
    context: {
      slug: post.node.fields.slug,
      title: post.node.frontmatter.title,
      lang: post.node.frontmatter.lang
    },
  })
})



}