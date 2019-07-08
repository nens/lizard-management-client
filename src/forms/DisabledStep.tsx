import React, { Component } from "react";
import { connect } from "react-redux";

import CheckMark from "./CheckMark";
import StepIndicator from "./StepIndicator";
import { FormattedMessage } from "react-intl";

import formStyles from "../styles/Forms.css";
import inputStyles from "../styles/Input.css";
import buttonStyles from "../styles/Buttons.css";

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
