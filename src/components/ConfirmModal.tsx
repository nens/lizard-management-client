import React from 'react';
import Overlay from './../components/Overlay';
import styles from './ConfirmModal.module.css';
import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  title: string,
  buttonName?: string,
  onClick?: () => void,
}

const ConfirmModal: React.FC<MyProps> = (props) => {
  const {
    title,
    buttonName
  } = props;

  return (
    <Overlay confirmModal>
      <div className={styles.Modal}>
        <div className={styles.ModalHeader}>
          {title}
        </div>
        <div className={styles.ModalBody}>
          {props.children}
        </div>
        <div className={styles.ModalFooter}>
          {buttonName ? (
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Success}`}
              onClick={props.onClick}
            >
              {buttonName}
            </button>
          ) : null}
        </div>
      </div>
    </Overlay>
  )
}

export default ConfirmModal;