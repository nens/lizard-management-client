import React from 'react';
// import actionsIcon from "../images/table_actions_button_icon.svg";
import styles from './ActionButton.module.css';


interface Props {
  actions: string[];
  onChange: ((string:string)=>void)
  clickableComponent: JSX.Element
}

const ActionButtons: React.FC<Props> = ({actions, onChange, clickableComponent }) => {
  return (
    <div
      className={styles.ActionButtons}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: "10px",
        // backgroundColor: tableRow.markAsDeleted? "red": "blue",
      }}
    >
      <select
        // className={styles.ActionButtonsSelect}
        // set the default value so clicking on another value is counted as a "onchange" by react.
        value={"Actions"}
        onChange={event=>{
          onChange(event.target.value+'')
        }}
      >
        {
          actions.map(action => <option value={action}>{action}</option>)
        }
        {/* use this hidden option */}
        <option hidden value="Actions">Actions</option>
      </select>
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="6" height="24" viewBox="0 0 4 16"><defs><style></style></defs><g transform="translate(-192)"><g transform="translate(192)"><circle cx="2" cy="2" r="2" transform="translate(0 6)"/><circle cx="2" cy="2" r="2" transform="translate(0 12)"/><circle cx="2" cy="2" r="2"/></g></g></svg> */}
      {clickableComponent}
      {/* use svg instead of img so we can make hover in css work */}
      {/* <img src={actionsIcon} alt="actions dropdown button icon"/> */}
    </div>
  )
};

export default ActionButtons;