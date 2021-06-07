import React from 'react';
import { NavLink } from "react-router-dom";
import styles from './ExplainSideColumn.module.css';
import backArrow from '../images/back_arrow.svg';

interface MyProps {
  imgUrl: string,
  imgAltDescription: string,
  headerText: string,
  explanationText: string | JSX.Element,
  backUrl: string,
  fieldName?: string, // for the animation effect of explain box to work when moving to a new field in form
}

export const ExplainSideColumn: React.FC<MyProps> = ({
  imgUrl, imgAltDescription, headerText, explanationText, backUrl, fieldName, children
}) => {
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
          <NavLink to={backUrl}><span style={{fontSize:"36px"}}>
            <img className={styles.BackArrow} alt="back" src={backArrow}/>
          </span></NavLink>
        </div>
        <div style={{display:"flex", justifyContent: "center"}}>
          <img src={imgUrl} alt={imgAltDescription? imgAltDescription: "Left sidebar icon"}/>
        </div>
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
          key={fieldName}
          className={styles.ExplainBoxEffect}
          style={{
            backgroundColor: "#FCFCFC",
            borderColor: "#A1A1A1",
            borderStyle: "solid",
            borderWidth: "0.5px",
            padding: "40px",
            borderRadius: "5px",
            // this doesnot work, it also takes the place of the pagination..
            // flex: "1",
          }}
        >
          <span
            style={{
              lineHeight: "28px"
            }}
          >
            {explanationText}
          </span>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}