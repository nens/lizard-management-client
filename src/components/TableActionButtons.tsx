import React from 'react';
import {useState} from 'react';
import actionsIcon from "../images/table_actions_button_icon.svg";
import styles from './TableActionButtons.module.css';


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
  // const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      className={styles.TableActionButtons}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "10px",
      }}
    >
      <img src={actionsIcon} alt="actions dropdown button icon"/>
      <select
        // className={styles.ActionButtonsSelect}
        // set the default value so clicking on another value is counted as a "onchange" by react.
        value={"Actions"}
        onChange={event=>{
          const value = event.target.value;
          const currentAction = actions.find(action => action.displayValue === value)
          if (currentAction) {
            // use a timeout to allow the select box to close so the confirm box of the delete option is not blocked by it
            window.setTimeout(()=>{currentAction.actionFunction(tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage);},0)
          }
        }}
      >
        {
          actions.map(action => <option value={action.displayValue}>{action.displayValue}</option>)
        }
        {/* use this hidden option */}
        <option hidden value="Actions">Actions</option>
      </select>
    </div>
  )
};

export default TableActionButtons;