import React from 'react';
import Overlay from './../components/Overlay';
import modalStyles from '../styles/Modal.module.css';
import buttonStyles from './../styles/Buttons.module.css';
import {useState,}  from 'react';
// import Checkbox from './Checkbox';



interface MyProps {
  title: string,
  buttonConfirmName?: string,
  onClickButtonConfirm?: () => void,
  cancelAction?: () => void,
  disableButtons?: boolean,
  closeDialogAction?: () => void,
  // requiredCheckboxText works, but is currently not used
  requiredCheckboxText?: string,
}

const Modal: React.FC<MyProps> = (props) => {
  const {
    title,
    buttonConfirmName,
    onClickButtonConfirm,
    cancelAction,
    disableButtons,
    closeDialogAction,
    requiredCheckboxText,
  } = props;

  const [checkboxState, /*setCheckboxState*/] = useState<boolean>(false);

  return (
    // todo: remve this confirmModal attribute, but some css in the overlay depends on it
    <Overlay confirmModal handleClose={()=>{cancelAction && cancelAction()}}>
      <div className={modalStyles.Modal}>
        <div className={modalStyles.ModalHeader}>
          {title}
          {closeDialogAction? <button onClick={(e)=>{closeDialogAction()}}>x</button>:null}
        </div>
        <div className={modalStyles.ModalBody}>
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
                disabled={disableButtons}
              >
                Cancel
              </button>
            ) : null}
            {buttonConfirmName ? (
              <button
                className={`${buttonStyles.Button} ${buttonStyles.Danger}`}
                onClick={onClickButtonConfirm}
                disabled={disableButtons || (checkboxState===false && requiredCheckboxText !== undefined)}
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