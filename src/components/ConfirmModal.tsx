import React from 'react';
import Overlay from './../components/Overlay';
import styles from './ConfirmModal.module.css';
import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  title: string,
  buttonConfirmName?: string,
  onClickButtonConfirm?: () => void,
  cancelAction?: () => void,
  disableButtons?: boolean
}

const ConfirmModal: React.FC<MyProps> = (props) => {
  const {
    title,
    buttonConfirmName,
    onClickButtonConfirm,
    cancelAction,
    disableButtons,
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
          {cancelAction ? (
            <button
              className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
              onClick={cancelAction}
              disabled={disableButtons}
            >
              Cancel
            </button>
          ) : null}
          {buttonConfirmName ? (
            <button
              className={`${buttonStyles.Button} ${buttonStyles.Danger}`}
              onClick={onClickButtonConfirm}
              disabled={disableButtons}
            >
              {buttonConfirmName}
            </button>
          ) : null}
        </div>
      </div>
    </Overlay>
  )
}

export default ConfirmModal;