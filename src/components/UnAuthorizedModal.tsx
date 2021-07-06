import React from 'react';
import ModalBackground from './ModalBackground';
import styles from './UnAuthorizedModal.module.css';
import buttonStyles from './../styles/Buttons.module.css';

interface Props {
  handleClose: () => void;
  redirectHome: () => void;
  handleOpenOrganisationSwitcher: () => void;
}

const UnAuthorizedModal = (props: Props) => {

  const { redirectHome, handleOpenOrganisationSwitcher} = props;

  return (
    <ModalBackground
      title={'Not Authorized to view this page'}
      // handleClose={() => handleClose()}
      height={'400px'}
    >
      <div className={styles.ModalBody}>
        <span>You are not authorized to view this page. <br/> Maybe you are authorized with a different organisation?</span>
      </div>
      <div className={styles.ModalFooter}>
        {/* If we want the cancel button, then we need to make sure al forms become read only now as well */}
        {/* <button
          className={buttonStyles.LinkCancel}
          onClick={()=>{handleClose()}}
        >
          Cancel
        </button> */}
        <button
          className={buttonStyles.NewButton}
          onClick={redirectHome}
        >
          Home
        </button>
        <button
          className={buttonStyles.NewButton}
          onClick={()=>{
            handleOpenOrganisationSwitcher()
          }}
        >
          Switch organisation
        </button>
      </div>
    </ModalBackground>
  )
}

export default UnAuthorizedModal;