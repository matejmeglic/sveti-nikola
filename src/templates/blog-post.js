import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Maps from "../components/Maps"
import { rhythm } from "../utils/typography"
import '../styles/Maps.css';
import RouteColor from "../components/RouteColor"
import SEO from "../components/seo"


const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark // post data
  const siteTitle = data.site.siteMetadata.title // for Layout component
  const jsonData = data.allPublicJson.edges[0].node; // all json data (for Map component)
  const language = post.frontmatter.lang; // post language 
  const translation = jsonData.languages; // array of translations from json
  var icons = ["bikefriendly","carfriendly","offroadfriendly"]; // set up array of options for html render (hackish)
  var labels = ["label_routeDuration", "label_routeLength", "label_lastUpdated","label_routeDescription", "label_warning", "post_warning_condition", "post_warning_equipment", "post_warning_water", "post_warning_snakes", "post_warning_generalDanger", "label_about",  "post_help_project", "post_github", "label_authors","post_warning_responsibility"]; // translations to search for in json
  var translationResults = []; // results to place in html
  var translatedLabel = "";
  var marked = "";

  // extract desired text in a correct language from json file 
  function GetTranslation(mdElement){
    translatedLabel = "";
    translation.forEach((itemTrans) => {
      if (itemTrans.item === mdElement) {
          var translationObject = Object.keys(itemTrans.translation);
          translationObject.forEach((descriptionLang) => {
            if (descriptionLang === language) {
              translatedLabel = itemTrans.translation[descriptionLang];
            }
          });
      }
    })
  }
 
  // run through array and get translations for each label
  function RenderTranslations(){
    // get translations for labels
    labels.forEach((label) => {
        GetTranslation(label);
        translationResults.push(translatedLabel);
    });
    // get translations for md frontmatter
    var i = 0;
    icons.forEach((icon) => {
      if (post.frontmatter[icon] === "y") {
        GetTranslation(icon);
        icons[i] = translatedLabel;
      } else {
        icons[i] = "";
      }
      i++;
    });
    // route marked?
    if (post.frontmatter.marked === "y") {
      GetTranslation("post_marked");
    } else if (post.frontmatter.marked === "n") {
      GetTranslation("post_notmarked");
    }
    marked = translatedLabel;

    
  }
  
 RenderTranslations();
 
  return (
  <div>
      <SEO title={post.frontmatter.title} description={post.excerpt} lang2={language}/>
      <Layout title={siteTitle} />
      <Maps geoJsonData={jsonData} />
      <div className="post">
      <RouteColor title={post.frontmatter.title} jsonData={jsonData}  cssClass="boxColor"></RouteColor>
        <span className="boxInfo">
          <h1 style={{marginTop: rhythm(1), marginBottom: 10, textAlign: "left"}}>
            {post.frontmatter.title}
          </h1>
          <div id="info">
            <span>{marked}</span><br />
            <span>{translationResults[0]} {post.frontmatter.time}</span><br />
            <span>{translationResults[1]} {post.frontmatter.length}</span><br />
            <span>{translationResults[2]} {post.frontmatter.date}</span><br />
          </div>
            <br />
          <div className="approachType">
            <span>{icons[0]}{" "}{icons[1]}{" "}{icons[2]}</span>
          </div>
            <br />
          <hr style={{marginBottom: rhythm(1)}} />
        </span>
        
        <h4>{translationResults[4]}</h4>
        <div className="warnings">  
          <ul>
            <li>{translationResults[5]}</li>
            <li>{translationResults[6]}</li>
            <li>{translationResults[7]}</li>
            <li>{translationResults[8]}</li>
            <li>{translationResults[9]}</li>
            <li>{translationResults[14]}</li>
          </ul>
        </div>
        <hr style={{marginBottom: rhythm(1)}} />
        <h3>{translationResults[3]}</h3>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <br />
        <h3>{translationResults[10]}</h3>
        <div>  
          <ul>
            <li>{translationResults[11]}</li>
            <li>{translationResults[12]} <a href="https://github.com/matejmeglic/sveti-nikola" target="_blank" rel="noopener noreferrer">GH Repo</a></li>
          </ul>
          
        </div>


      </div>
      <hr style={{marginBottom: rhythm(1)}} />
      <p style={{textAlign:"center"}}>{translationResults[13]}</p>
      <br />
    </div>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
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
    },
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
        mapstrack
        warning
        marked
        bikefriendly
        carfriendly
        offroadfriendly
      }
    },
  }
`