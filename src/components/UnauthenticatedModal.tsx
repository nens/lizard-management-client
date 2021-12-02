import React from 'react';
import ModalBackground from './ModalBackground';
import styles from './UnauthenticatedModal.module.css';
import buttonStyles from './../styles/Buttons.module.css';
import {
  getSsoLogin,
} from '../reducers';
import {  useSelector } from "react-redux";


interface Props {
  handleClose: () => void;
  redirectHome: () => void;
}

const UnauthenticatedModal = (props: Props) => {

  const { redirectHome} = props;
  const ssoLogin = useSelector(getSsoLogin);

  return (
    <ModalBackground
      title={'Not logged-in'}
      style={{
        height: 400
      }}
    >
      <div className={styles.ModalBody}>
        <span>You need to be logged in to use this page</span>
      </div>
      <div className={styles.ModalFooter}>
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

export default UnauthenticatedModal;