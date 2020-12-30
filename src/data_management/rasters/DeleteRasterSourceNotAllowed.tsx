import React from 'react';
import Overlay from '../../components/Overlay';
import styles from './DeleteRasterSourceNotAllowed.module.css';
// import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  closeDialogAction: () => void,
}

const DeleteRasterSourceNotAllowed: React.FC<MyProps> = (props) => {
  const {
    closeDialogAction,
  } = props;

  return (
    <Overlay 
      // Todo confirmModal attribute is needed for styling. Need to change it to deleteRasterSourceNotAllowed ?
      // deleteRasterSourceNotAllowed
      confirmModal 
      handleClose={()=>{closeDialogAction()}}
    >
      <div className={styles.Modal}>
        <div className={styles.ModalHeader}>
          {"Deleting this Raster-source currently not possible"}
          <button onClick={(e)=>{closeDialogAction()}}>x</button>
        </div>
        <div className={styles.ModalBody}>
          {props.children}
        </div>
        {/* <div className={styles.ModalFooter} style={cancelAction?{justifyContent: "space-between"}:{justifyContent: "flex-end"}}>
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
        </div> */}
      </div>
    </Overlay>
  )
}

export default DeleteRasterSourceNotAllowed;