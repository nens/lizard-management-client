import React from 'react';
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
      {clickableComponent}
    </div>
  )
};

export default ActionButtons;