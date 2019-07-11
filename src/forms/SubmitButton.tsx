import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import buttonStyles from "../styles/Buttons.css";
import inputStyles from "../styles/Input.css";

interface SubmitButtonProps {
  notValidatedSteps: number[],
  submit: () => void
};

export default class SubmitButton extends Component<SubmitButtonProps, {}> {
  render() {
    const { notValidatedSteps, submit } = this.props;
    const validated = notValidatedSteps.length === 0;

    if (validated) {
      return (
        <div className={inputStyles.InputContainer}>
          <button
            type="button"
            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
            style={{ marginTop: 10 }}
            onClick={submit}
          >
            <FormattedMessage
              id="rasters.submit"
              defaultMessage="Submit"
            />
          </button>
        </div>
      )
    } else {
      return (
        <div className={inputStyles.InputContainer}>
          <button
            type="button"
            className={`${buttonStyles.Button} ${buttonStyles.Inactive}`}
            style={{
              marginTop: 10,
              color: "grey",
              cursor: "not-allowed"
            }}
            onClick={submit}
          >
            <FormattedMessage
              id="rasters.submit"
              defaultMessage="Submit"
            />
          </button>
          {/* <span
            className={`${inputStyles.SubmitSpan}`}
            style={{ paddingLeft: 20, verticalAlign: "middle" }}
          >
            {`Please complete step${notValidatedSteps.length === 1 ? "": "s"} ` +
             notValidatedSteps + " before submitting."}
          </span> */}
        </div>
      )
    }
  }
}
