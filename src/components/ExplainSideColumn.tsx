import React from 'react';

import { NavLink } from "react-router-dom";
import rasterIcon from "../images/raster_layers_logo_explainbar.svg";



export const ExplainSideColumn = (props:any) => {

  const {imgUrl, headerText,explainationText, backUrl} = props;

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "stretch",
        // width: "100%",
        width: "80%",
        // minWidth: "80%",
        margin: "auto",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <NavLink to={backUrl}><span style={{fontSize:"36px"}}>{"←"}</span></NavLink>
        <img src={imgUrl}></img>
        <h2>{headerText}</h2>
        <div
          style={{
            borderColor: "#A1A1A1",
            borderStyle: "solid",
            borderWidth: "0.5px",
          }}
        >
          {explainationText}
        </div>

      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >

      
        {props.children}
      </div>
    </div>
  );
}