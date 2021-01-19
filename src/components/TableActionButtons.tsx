import React from 'react';
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
}

const TableActionButtons: React.FC<Props> = ({actions, tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage }) => {
  return (
    <ActionButton
      actions={actions.map(action=>action.displayValue)}
      onChange={actionDisplayValue=>{
          const currentAction = actions.find(action => action.displayValue === actionDisplayValue)
          if (currentAction) {
            // use a timeout to allow the select box to close so the confirm box of the delete option is not blocked by it
            window.setTimeout(()=>{currentAction.actionFunction(tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage);},0)
          }
      }}
      clickableComponent={<svg xmlns="http://www.w3.org/2000/svg" width="6" height="24" viewBox="0 0 4 16"><defs><style></style></defs><g transform="translate(-192)"><g transform="translate(192)"><circle cx="2" cy="2" r="2" transform="translate(0 6)"/><circle cx="2" cy="2" r="2" transform="translate(0 12)"/><circle cx="2" cy="2" r="2"/></g></g></svg>
      }
    />
  );
  // return (
  //   <div
  //     className={styles.TableActionButtons}
  //     style={{
  //       width: "100%",
  //       height: "100%",
  //       position: "relative",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       paddingRight: "10px",
  //       // backgroundColor: tableRow.markAsDeleted? "red": "blue",
  //     }}
  //   >
  //     <select
  //       // className={styles.ActionButtonsSelect}
  //       // set the default value so clicking on another value is counted as a "onchange" by react.
  //       value={"Actions"}
  //       onChange={event=>{
  //         const value = event.target.value;
  //         const currentAction = actions.find(action => action.displayValue === value)
  //         if (currentAction) {
  //           // use a timeout to allow the select box to close so the confirm box of the delete option is not blocked by it
  //           window.setTimeout(()=>{currentAction.actionFunction(tableRow,tableData,setTableData,triggerReloadWithCurrentPage, triggerReloadWithBasePage);},0)
  //         }
  //       }}
  //     >
  //       {
  //         actions.map(action => <option value={action.displayValue}>{action.displayValue}</option>)
  //       }
  //       {/* use this hidden option */}
  //       <option hidden value="Actions">Actions</option>
  //     </select>
  //     <svg xmlns="http://www.w3.org/2000/svg" width="6" height="24" viewBox="0 0 4 16"><defs><style></style></defs><g transform="translate(-192)"><g transform="translate(192)"><circle cx="2" cy="2" r="2" transform="translate(0 6)"/><circle cx="2" cy="2" r="2" transform="translate(0 12)"/><circle cx="2" cy="2" r="2"/></g></g></svg>
  //     {/* use svg instead of img so we can make hover in css work */}
  //     {/* <img src={actionsIcon} alt="actions dropdown button icon"/> */}
  //   </div>
  // )
};

export default TableActionButtons;