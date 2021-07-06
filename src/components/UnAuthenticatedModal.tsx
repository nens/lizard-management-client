import React from 'react';
import ModalBackground from './ModalBackground';
import styles from './UnAuthenticatedModal.module.css';
import buttonStyles from './../styles/Buttons.module.css';
import {
  getSsoLogin,
} from '../reducers';
import {  useSelector } from "react-redux";


interface Props {
  handleClose: () => void;
  redirectHome: () => void;
}

const UnAuthenticatedModal = (props: Props) => {

  const {handleClose, redirectHome} = props;
  const ssoLogin = useSelector(getSsoLogin);

  return (
    <ModalBackground
      title={'Not logged-in'}
      handleClose={() => handleClose()}
      height={'400px'}
    >
      <div className={styles.ModalBody}>
        <span>You need to be logged in to use this page</span>
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
            window.location.href = `${ssoLogin}&next=${window.location.href}`;
          }}
        >
          Login
        </button>
      </div>
    </ModalBackground>
  )
}

export default UnAuthenticatedModal;