import React from "react"
import { css } from "@emotion/core"

export default function RouteColor({title,jsonData, cssClass}) {
    // const old = "background-color:#75CFF0;"; // ocean color [legacy]
    var color;
    
    // extract #hex color from json and apply it to md section for route differentiation
    jsonData.routes.forEach(element => {
      if (element.route === title) {
        color = element.color;
      }
    });
       
    return (
      <div>
        <span className={cssClass} css={css`background-color:${color};`} />
      </div>
    )
    
    

  
}

