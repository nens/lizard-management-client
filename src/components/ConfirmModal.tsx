import React from 'react';
import Overlay from './../components/Overlay';
import modalStyles from '../styles/Modal.module.css';
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
    <Overlay confirmModal handleClose={()=>{cancelAction && cancelAction()}}>
      <div className={modalStyles.Modal}>
        <div className={modalStyles.ModalHeader}>
          {title}
        </div>
        <div className={modalStyles.ModalBody}>
          {props.children}
        </div>
        <div className={modalStyles.ModalFooter} style={cancelAction?{justifyContent: "space-between"}:{justifyContent: "flex-end"}}>
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