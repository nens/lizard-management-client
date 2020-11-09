import React from 'react';

import { NavLink } from "react-router-dom";

export const ExplainSideColumn = (props:any) => {

  const {imgUrl, headerText,explainationText, backUrl} = props;

  return (
    <div 
      style={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: "346px",
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          alignItems: "stretch",
          margin: "8px",
          marginRight: "16px",
          
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
          }}
          
        >
          <NavLink to={backUrl}><span style={{fontSize:"36px"}}>{"←"}</span></NavLink>
        </div>
        <img src={imgUrl} alt={""}></img>
        <h2
          style={{
            marginBottom: "32px",
            marginTop: "32px",
            textTransform: "uppercase",
            textAlign: "center",
            color: "#2C3E50",
            fontSize: "medium",
            
          }}
        >
          {headerText}
        </h2>
        <div
          style={{
            borderColor: "#A1A1A1",
            borderStyle: "solid",
            borderWidth: "0.5px",
            padding: "24px",
            borderRadius: "5px",
            // this doesnot work, it also takes the place of the pagination..
            // flex: "1",
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