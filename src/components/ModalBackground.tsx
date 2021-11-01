import React, { useEffect } from 'react';
import styles from './ModalBackground.module.css';

interface MyProps {
  title: string,
  handleClose?: () => void,
  style?: {
    [key: string]: string | number
  },
}

const ModalBackground: React.FC<MyProps> = (props) => {
  // Add event listener to close modal on 'ESCAPE'
  useEffect(() => {
    const closeModalOnEsc = (e: any) => {
      if (e.key === 'Escape' && props.handleClose) props.handleClose();
    };
    window.addEventListener('keydown', closeModalOnEsc);
    return () => window.removeEventListener('keydown', closeModalOnEsc);
  });

  return (
    <div className={styles.ModalBackground}>
      <div
        className={styles.ModalBox}
        style={props.style}
      >
        <div className={styles.ModalTitle}>
          <span>{props.title}</span>
          {props.handleClose?
            <span
              className={styles.CloseButton}
              onClick={() => props.handleClose && props.handleClose()}
            >
              <i className="material-icons">close</i>
            </span>
            :null}
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default ModalBackground;