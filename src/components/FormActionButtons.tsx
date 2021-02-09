import React from 'react';
import ActionButton from './ActionButton';


export interface Action {
  displayValue: string;
  actionFunction: any; // function that takes uuid and performs action
}

interface Props {
  actions: Action[];
}

const FormActionButtons: React.FC<Props> = ({ actions }) => {
  return (
    <ActionButton
      actions={actions.map(action=>action.displayValue)}
      onChange={actionDisplayValue=>{
          const currentAction = actions.find(action => action.displayValue === actionDisplayValue);
          if (currentAction) currentAction.actionFunction();
      }}
      display={'ACTIONS'}
      forParent={'Form'}
    />
  );
};

export default FormActionButtons;