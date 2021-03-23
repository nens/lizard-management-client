import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
// We will need styles later to factor out the over stule of the svg passed to clickableComponent
// import styles from './TableActionButtons.module.css';
import ActionButton from './ActionButton';


export interface Action {
  displayValue: string;
  actionFunction: any; // function that takes uuid and performs action
}

interface Props {
  actions: Action[];
  tableRow:any;
  tableData:any;
  setTableData:any;
  triggerReloadWithCurrentPage:any; 
  triggerReloadWithBasePage:any;
  editUrl: string;
}

const TableActionButtons: React.FC<Props & RouteComponentProps> = ({actions, tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage, editUrl, history }) => {
  // Edit action to open the object in the form
  // The edit action is always available for all the tables
  const editAction = {
    displayValue: 'Edit',
    actionFunction: () => history.push(editUrl)
  };

  // Add the edit action to the list of available actions for table
  const actionList = [...actions, editAction];

  return (
    <ActionButton
      actions={actionList.map(action => action.displayValue)}
      onChange={actionDisplayValue=>{
          const currentAction = actionList.find(action => action.displayValue === actionDisplayValue);
          if (currentAction) currentAction.actionFunction(tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage);
      }}
      display={<svg xmlns="http://www.w3.org/2000/svg" width="6" height="24" viewBox="0 0 4 16"><defs><style></style></defs><g transform="translate(-192)"><g transform="translate(192)"><circle cx="2" cy="2" r="2" transform="translate(0 6)"/><circle cx="2" cy="2" r="2" transform="translate(0 12)"/><circle cx="2" cy="2" r="2"/></g></g></svg>}
    />
  );
};

export default withRouter(TableActionButtons);