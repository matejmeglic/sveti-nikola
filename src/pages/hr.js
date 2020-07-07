import React from "react"
import { Link, graphql } from "gatsby"
import { css } from "@emotion/core"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"
import Maps from "../components/Maps"
import RouteColor from "../components/RouteColor"

export default function Home({data}) {
  const jsonData = data.allPublicJson.edges[0].node;
  const language = data.allMarkdownRemark.edges[0].node.frontmatter.lang; // post language 
  const translation = jsonData.languages; // array of translations from json
  var labels = ["label_warning", "post_warning_condition", "post_warning_equipment", "post_warning_water", "post_warning_snakes", "post_warning_generalDanger", "label_about",  "post_help_project", "post_github", "label_authors","post_warning_responsibility"]; // translations to search for in json
  var translationResults = []; // results to place in html
  var translatedLabel = "";


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

    
  }
  
 RenderTranslations();



  


  return (
    <div>
      <Layout />
      <Maps geoJsonData={jsonData} />
      <div className="wrapper">
        {data.allMarkdownRemark.edges.map(({ node }) => ( 
          <div key={node.id}  className="content">
          <RouteColor title={node.frontmatter.title} jsonData={jsonData}  cssClass="boxColorMain"></RouteColor>
          <span className="boxInfo">
            <Link to={node.fields.slug} css={css`text-decoration: none; color: inherit;`}>
              <h3 css={css`margin-bottom: ${rhythm(1 / 4)};`}>{node.frontmatter.title}{" "}</h3>
              <p css={css`text-align: justify;`}>{node.excerpt}</p>
            </Link>
            </span>
          </div>
        ))}
      
        <hr style={{marginBottom: rhythm(1)}} />
        <h4>{translationResults[0]}</h4>
          <div className="warnings">  
            <ul>
              <li>{translationResults[1]}</li>
              <li>{translationResults[2]}</li>
              <li>{translationResults[3]}</li>
              <li>{translationResults[4]}</li>
              <li>{translationResults[5]}</li>
              <li>{translationResults[10]}</li>
            </ul>
          </div>
        <hr style={{marginBottom: rhythm(2)}} />
        <h3>{translationResults[6]}</h3>
          <div>  
            <ul>
              <li>{translationResults[7]}</li>
              <li>{translationResults[8]} <a href="https://github.com/matejmeglic/sveti-nikola" target="_blank" rel="noopener noreferrer">GH Repo</a></li>
            </ul>
          </div>
        </div> 
        <br />
        <hr style={{marginBottom: rhythm(1)}} />
        <p style={{textAlign:"center"}}>{translationResults[9]}</p>
    </div> 
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