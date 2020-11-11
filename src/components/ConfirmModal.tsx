import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import Overlay from './../components/Overlay';
import styles from './ConfirmModal.module.css';
import buttonStyles from './../styles/Buttons.module.css';

interface MyProps {
  title: string,
  buttonName: string,
  url: string
}

const ConfirmModal: React.FC<MyProps & RouteComponentProps> = (props) => {
  const {
    title,
    buttonName,
    url
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
          <button
            className={`${buttonStyles.Button} ${buttonStyles.Success}`}
            onClick={() => props.history.push(url)}
          >
            {buttonName}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

export default withRouter(ConfirmModal);