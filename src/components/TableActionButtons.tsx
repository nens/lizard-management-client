import React from 'react';

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
}

const TableActionButtons: React.FC<Props> = ({actions, tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage }) => {
  return (
    <select
      value={"actions"}
      onChange={event=>{
        const value = event.target.value;
        const currentAction = actions.find(action => action.displayValue === value)
        if (currentAction) {
          currentAction.actionFunction(tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage);
        }
      }}
    >
      <option value={"actions"}>Actions</option>
      {
        actions.map(action => <option value={action.displayValue}>{action.displayValue}</option>)
      }
    </select>
  )
};

export default TableActionButtons;