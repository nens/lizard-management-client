import React from 'react';
import agreementIcon from "../images/agreement.svg";


const NoOrganisationFoundComponent = () => {
  
  return (
      <div 
        style={{
          padding: "32px"
        }}
      >
        <img alt={"Contract Icon"} src={agreementIcon}></img>
        <h1>No contract found for the selected organisation</h1>
        <span>If you need a contract here please contact: <a href="mailto:email@nelen-schuurmans.nl">email@nelen-schuurmans.nl</a></span>
        
      </div>
  )
};

export default NoOrganisationFoundComponent;