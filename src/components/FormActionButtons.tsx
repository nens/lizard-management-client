import React from "react";
import ActionButton from "./ActionButton";

export interface Action {
  displayValue: string;
  actionFunction: () => void; // function that takes uuid and performs action
}

interface Props {
  actions: Action[];
}

const FormActionButtons: React.FC<Props> = ({ actions }) => {
  return (
    <ActionButton
      actions={actions.map((action) => action.displayValue)}
      onChange={(actionDisplayValue) => {
        const currentAction = actions.find((action) => action.displayValue === actionDisplayValue);
        if (currentAction) currentAction.actionFunction();
      }}
      display={"ACTIONS"}
      forForm
    />
  );
};

export default FormActionButtons;
