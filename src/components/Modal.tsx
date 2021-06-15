import React from 'react';
import Overlay from './../components/Overlay';
import modalStyles from '../styles/Modal.module.css';
import buttonStyles from './../styles/Buttons.module.css';
import {useState,}  from 'react';

interface MyProps {
  title: string,
  buttonConfirmName?: string,
  onClickButtonConfirm?: () => void,
  cancelAction?: () => void,
  disabledCancelAction?: boolean,
  disabledConfirmAction?: boolean,
  // requiredCheckboxText works, but is currently not used
  requiredCheckboxText?: string,
  height?: number | string, // height for modal body, default is auto
}

const Modal: React.FC<MyProps> = (props) => {
  const {
    title,
    buttonConfirmName,
    onClickButtonConfirm,
    cancelAction,
    disabledCancelAction,
    disabledConfirmAction,
    requiredCheckboxText,
    height
  } = props;

  const [checkboxState, /*setCheckboxState*/] = useState<boolean>(false);

  return (
    <Overlay
      confirmModal={true}
      handleClose={()=>{
        !disabledCancelAction && // to prevent ESC key to close the modal when buttons are disabled
        cancelAction &&
        cancelAction()
      }}
    >
      <div className={modalStyles.Modal}>
        <div className={modalStyles.ModalHeader}>
          {title}
          {cancelAction ? <button onClick={cancelAction} disabled={disabledCancelAction}>x</button> : null}
        </div>
        <div
          className={modalStyles.ModalBody}
          style={{ height: height }}
        >
          {props.children}
        </div>
        {/* {requiredCheckboxText?
          <div className={modalStyles.ModalFooter} style={{display:"fex", justifyContent: "flex-start"}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Checkbox  
                checked={checkboxState}
                onChange={()=>{
                  if (checkboxState) {
                    setCheckboxState(false);
                  } else {
                    setCheckboxState(true);
                  }
                }}
              />
              <label 
                style={{marginLeft: "20px", marginBottom: 0}}
                >{requiredCheckboxText}</label>
            </div>
          </div>
        :
        null
        } */}
        { cancelAction || buttonConfirmName?
          <div className={modalStyles.ModalFooter} style={cancelAction?{justifyContent: "space-between"}:{justifyContent: "flex-end"}}>
            {cancelAction ? (
              <button
                className={`${buttonStyles.Button} ${buttonStyles.LinkCancel}`}
                onClick={cancelAction}
                disabled={disabledCancelAction}
              >
                Cancel
              </button>
            ) : null}
            {buttonConfirmName ? (
              <button
                className={`${buttonStyles.Button} ${buttonStyles.Danger}`}
                onClick={onClickButtonConfirm}
                disabled={disabledConfirmAction || (checkboxState===false && requiredCheckboxText !== undefined)}
                title={checkboxState===false && requiredCheckboxText !== undefined? "First confirm the checkbox that you understood this warning" : "" }
              >
                {buttonConfirmName}
              </button>
            ) : null}
          </div>
        :null}
      </div>
    </Overlay>
  )
}

export default Modal;