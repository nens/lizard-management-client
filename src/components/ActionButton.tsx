import React, { useEffect, useState } from 'react';
import styles from './ActionButton.module.css';
import ActionList from './ActionList';


interface Props {
  actions: string[];
  onChange: ((string:string)=>void);
  display: string | JSX.Element;
  forParent: 'Table' | 'Form';
}

const ActionButtons: React.FC<Props> = ({actions, onChange, display, forParent }) => {
  const [showActionList, setShowActionList] = useState<boolean>(false);

  useEffect(() => {
    const closeModalOnEsc = (e: any) => {
      if (e.key === 'Escape') setShowActionList(false);
    };
    window.addEventListener('keydown', closeModalOnEsc);
    return () => window.removeEventListener('keydown', closeModalOnEsc);
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
        className={forParent === 'Table' ? styles.TableActionButton : styles.FormActionButton}
        onClick={() => setShowActionList(!showActionList)}
        onBlur={() => setShowActionList(false)}
      >
        {display}
      </button>
      <ActionList
        actions={actions}
        onChange={value => onChange(value)}
        showActionList={showActionList}
        renderUp={forParent === 'Form'}
      />
    </div>
  )
};

export default ActionButtons;