import React, { useEffect, useState } from 'react';
import styles from './ActionButton.module.css';
import ActionList from './ActionList';


interface Props {
  actions: string[];
  onChange: (value: string) => void;
  display: string | JSX.Element;
  forForm?: boolean;
}

const ActionButtons: React.FC<Props> = ({actions, onChange, display, forForm }) => {
  const [showActionList, setShowActionList] = useState<boolean>(false);

  useEffect(() => {
    const closeActionListOnEsc = (e: any) => {
      if (e.key === 'Escape') setShowActionList(false);
    };
    window.addEventListener('keydown', closeActionListOnEsc);
    return () => window.removeEventListener('keydown', closeActionListOnEsc);
  });

  return (
    <div
      className={styles.ActionButtons}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <button
        className={forForm ? styles.FormActionButton : styles.TableActionButton}
        onClick={() => setShowActionList(!showActionList)}
        onBlur={() => setShowActionList(false)}
      >
        {display}
      </button>
      <ActionList
        actions={actions}
        onChange={value => onChange(value)}
        showActionList={showActionList}
        dropUp={forForm} // render drop-up for Form
      />
    </div>
  )
};

export default ActionButtons;