import React, { useState } from "react";
import styles from "./ColormapAllSteps.module.css";
import formStyles from "../styles/Forms.module.css";

interface ColormapStep {
  step: number,
  rgba: [number,number,number,number],
  label: string,
}

interface Props {
  title: string | JSX.Element,
  steps: ColormapStep[],
};

export const ColormapAllSteps: React.FC<Props> = (props) => {

  const {
    title,
    steps,
  } = props;


  return (
    <div>
      {steps.map((step:ColormapStep)=>{
        return(
          <div>
            <span>{step.step}</span>
            
          </div>
        );
      })}
    </div>
  );
}