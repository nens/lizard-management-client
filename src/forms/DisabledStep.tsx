import React, { Component } from "react";
import StepIndicator from "./StepIndicator";
import inputStyles from "../styles/Input.module.css";

interface DisabledStepProps {
  step: number;
  title: string;
}

export default class DisabledStep extends Component<DisabledStepProps, {}> {
  render() {
    const {
      step,
      title
    } = this.props;

    return (
      <div id={`Step-${step}`}>
        <StepIndicator
          indicator={step}
          active={false}
        />
        <div className={inputStyles.InputContainer}>
          <h3
            className={'mt-0'}
            style={{textDecoration: 'line-through'}}
          >
            {title}
          </h3>
        </div>
      </div>
    );
  }
}
